import {
  archiveExtensions,
  audioExtensions,
  codeExtensions,
  decodePercent,
  documentExtensions,
  feedExtensions,
  flashExtensions,
  fontExtensions,
  imageExtensions,
  installerExtensions,
  isAnyOf,
  isHostname,
  isHostOf,
  isIpAddress,
  isString,
  normalizeUrl,
  type Pattern,
  pageExtensions,
  parseUrl,
  resolveUrl,
  stripWww,
  subtitleExtensions,
  videoExtensions,
} from 'trousse'
import { defaultTrackingParams, defaultUnwrappers } from './defaults.js'
import { sessionParams } from './tracking/session.js'
import type { PurifyUrlOptions, TrackingEntry, TrackingParam, UrlUnwrapper } from './types.js'
import { unwrapperHosts } from './utils.js'

type TrackingMatcher = {
  literals: Set<string>
  patterns: Array<RegExp>
  entries: Array<TrackingEntry>
}

// The hostname without `www.`, as a value test sees it, and the urls an entry's hosts match: the
// url and, on a `www.` host, the url without it.
type PairHost = {
  host: string
  urls: Array<URL>
}

type QueryPair = [name: string, value: string]

// A signature covers the rest of the query, so dropping any param from it makes the server reject
// the url, as a CDN answers 401 to a signed file url without its `ts`.
const signatureParams = [
  'sig', // Generic CDN and redirect signature
  'signature', // CloudFront, AWS Signature Version 2
  'x-amz-signature', // AWS Signature Version 4 presigned url
  'x-goog-signature', // Google Cloud Storage V4 signed url
]

const pathParamRegex = /;([^;/=]+)=[^;/]*/g

const sessionLiterals = sessionParams.filter(isString).map((param) => param.toLowerCase())

const trackingMatcherCache = new WeakMap<Array<TrackingParam>, TrackingMatcher>()

const getTrackingMatcher = (params: Array<TrackingParam>): TrackingMatcher => {
  let cached = trackingMatcherCache.get(params)

  if (!cached) {
    const literals = new Set<string>()
    const patterns: Array<RegExp> = []
    const entries: Array<TrackingEntry> = []

    for (const param of params) {
      if (isString(param)) {
        literals.add(param.toLowerCase())
        continue
      }

      if (param instanceof RegExp) {
        patterns.push(param)
        continue
      }

      if (Array.isArray(param.hosts)) {
        entries.push({ ...param, hosts: param.hosts.map((host) => stripWww(host.toLowerCase())) })
        continue
      }

      entries.push(param)
    }

    cached = { literals, patterns, entries }
    trackingMatcherCache.set(params, cached)
  }

  return cached
}

// `search` ignores `lastIndex`, so a caller's `g` or `y` pattern matches on every call.
const matchesPattern = (text: string, pattern: RegExp): boolean => {
  return text.search(pattern) !== -1
}

// An entry host and the url's host match without `www.`, so `smzdm.com` covers `www.smzdm.com`.
const isPairHostOf = (pairHost: PairHost, hosts: Pattern | ReadonlyArray<Pattern>): boolean => {
  return pairHost.urls.some((url) => isHostOf(url, hosts))
}

const matchesEntry = (
  entry: TrackingEntry,
  name: string,
  value: string,
  pairHost: PairHost,
): boolean => {
  const isNameMatch = isString(entry.name)
    ? // biome-ignore lint/plugin/useAnyOfOrSameText: The caller folds the name once per param, and isAnyOf would fold and trim both sides per entry.
      entry.name.toLowerCase() === name
    : matchesPattern(name, entry.name)

  if (!isNameMatch) {
    return false
  }

  if (entry.hosts && !isPairHostOf(pairHost, entry.hosts)) {
    return false
  }

  if (entry.value instanceof RegExp) {
    return matchesPattern(value, entry.value)
  }

  if (entry.value) {
    return entry.value(value, pairHost.host)
  }

  return true
}

// A hostname in lowercase without its trailing dot, as `isHostOf` compares it: `example.com.` names
// the same host as `example.com`.
const normalizeHost = (hostname: string): string => {
  const host = hostname.toLowerCase()

  return host.endsWith('.') ? host.slice(0, -1) : host
}

const getPairHost = (url: URL): PairHost => {
  const hostname = normalizeHost(url.hostname)
  const host = stripWww(hostname)

  if (host === hostname) {
    return { host, urls: [url] }
  }

  return { host, urls: [url, parseUrl(`https://${host}`) ?? url] }
}

// A query pair decoded as `URLSearchParams` decodes it, except that an escape that is not UTF-8,
// such as `%FC`, stays as written.
const readQueryPair = (pair: string): QueryPair | undefined => {
  if (!pair) {
    return
  }

  const separator = pair.indexOf('=')
  const name = separator === -1 ? pair : pair.slice(0, separator)
  const value = separator === -1 ? '' : pair.slice(separator + 1)

  return [decodePercent(name.replaceAll('+', ' ')), decodePercent(value.replaceAll('+', ' '))]
}

const isSignaturePair = (pair: QueryPair | undefined): boolean => {
  return isAnyOf(pair?.[0], signatureParams)
}

// Takes the lowercased name and the decoded value.
const isTrackedPair = (
  matcher: TrackingMatcher,
  name: string,
  value: string,
  pairHost: PairHost,
): boolean => {
  if (matcher.literals.has(name)) {
    return true
  }

  if (matcher.patterns.some((pattern) => matchesPattern(name, pattern))) {
    return true
  }

  return matcher.entries.some((entry) => matchesEntry(entry, name, value, pairHost))
}

// Java servlet containers write the session id into the path, `/page;jsessionid=<id>`. Other
// path params, as `;ts=1`, address the resource.
const deletePathParams = (url: URL, matcher: TrackingMatcher): void => {
  const pathname = url.pathname.replace(pathParamRegex, (param, name: string) => {
    const lowerName = name.toLowerCase()

    if (sessionLiterals.includes(lowerName) && matcher.literals.has(lowerName)) {
      return ''
    }

    return param
  })

  if (pathname !== url.pathname) {
    url.pathname = pathname
  }
}

// A wrapper path can carry a session id, as `/external-link.jspa;jsessionid=<id>?url=`, which an
// unwrapper matching the exact path misses. A signed url keeps its path whole.
const deleteSessionPathParams = (url: URL, matcher: TrackingMatcher): void => {
  if (!url.pathname.includes(';')) {
    return
  }

  if (url.search.slice(1).split('&').map(readQueryPair).some(isSignaturePair)) {
    return
  }

  deletePathParams(url, matcher)
}

// Delete tracking params in place, from the query and from `;name=value` path params. Literal
// names match case-insensitively, and patterns are tested against the lowercased name. A url
// whose query carries a signature param is kept whole.
const deleteTrackingParams = (url: URL, trackingParams: Array<TrackingParam>): void => {
  const pairs = url.search.slice(1).split('&')
  const entries = pairs.map(readQueryPair)

  if (entries.some(isSignaturePair)) {
    return
  }

  const matcher = getTrackingMatcher(trackingParams)

  deletePathParams(url, matcher)

  if (!url.search) {
    return
  }

  const pairHost = getPairHost(url)

  // Alibaba DirectMail click urls answer 400 without their `ts` and do not check their `sign`.
  const keepsTs =
    isPairHostOf(pairHost, 'dm-cn.aliyuncs.com') && isAnyOf(url.pathname, '/trace/v1/report')

  // Kept pairs stay byte-for-byte: re-serializing through URLSearchParams turns
  // `%20` into `+`, `flag` into `flag=` and escapes `;`, which servers can read differently.
  const keptPairs = pairs.filter((_pair, index) => {
    const entry = entries[index]

    if (!entry) {
      return true
    }

    const [key, value] = entry
    const name = key.toLowerCase()

    if (keepsTs && name === 'ts') {
      return true
    }

    return !isTrackedPair(matcher, name, value, pairHost)
  })

  if (keptPairs.length === pairs.length) {
    return
  }

  url.search = keptPairs.join('&')
}

const controlCharactersRegex = /[\p{Cc}\u2028\u2029]/u
const dottedHostRegex = /[^.]\.[^.]/

// Extensions that are also TLDs, such as `example.zip`, stay valid hosts.
const tldExtensions = ['mobi', 'mov', 'zip']

const fileExtensions = new Set(
  [
    ...archiveExtensions,
    ...audioExtensions,
    ...codeExtensions,
    ...documentExtensions,
    ...feedExtensions,
    ...flashExtensions,
    ...fontExtensions,
    ...imageExtensions,
    ...installerExtensions,
    ...pageExtensions,
    ...subtitleExtensions,
    ...videoExtensions,
  ].filter((extension) => !tldExtensions.includes(extension)),
)

// Repairs a scheme such as `http:// https://host` and a host such as `example.com)` through
// `resolveUrl`, then drops a target that is not http, holds a control character, carries userinfo
// or keeps a junk host: not a hostname such as `,ccam.cc`, no dot between two labels, or a file
// extension.
const cleanTarget = (target: string | undefined): string | undefined => {
  if (!target) {
    return
  }

  const trimmed = target.trim()

  // The url parser drops a tab or a line feed inside a url, so the check reads the raw target.
  if (controlCharactersRegex.test(trimmed)) {
    return
  }

  const repaired = resolveUrl(trimmed)

  if (!repaired) {
    return
  }

  const parsed = parseUrl(repaired)

  // A target `https://example.com@example.net/` goes to example.net while reading as example.com.
  if (parsed?.username || parsed?.password) {
    return
  }

  const hostname = parsed?.hostname ?? ''

  if (!dottedHostRegex.test(hostname) && !isIpAddress(hostname)) {
    return
  }

  if (!isHostname(hostname)) {
    return
  }

  if (fileExtensions.has(hostname.slice(hostname.lastIndexOf('.') + 1))) {
    return
  }

  return repaired
}

const protocolRelativeRegex = /^\/\/[^/]/

// A protocol-relative target fails the http check, so it gets `https`: `//host/path`, as Embedly
// writes for Issuu.
const addTargetScheme = (target: string | undefined): string | undefined => {
  if (!target) {
    return
  }

  if (protocolRelativeRegex.test(target)) {
    return `https:${target}`
  }

  return target
}

type UnwrapperIndex = {
  byHost: Map<string, Array<UrlUnwrapper>>
  rest: Array<UrlUnwrapper>
  domainLength: number // Longest registered `.domain`, 0 when none
}

// A list seen once maps to undefined and gets no index, so a caller passing a new array per call
// pays no build. The second arrival of the same array builds it.
const unwrapperIndexes = new WeakMap<Array<UrlUnwrapper>, UnwrapperIndex | undefined>()

// Each host, and each `.domain` that also matches its subdomains, maps to the unwrappers registered
// for it plus every unregistered one, in list order, so the first match is the one a full scan
// finds. Any other host gets only the unregistered ones.
const buildUnwrapperIndex = (unwrappers: Array<UrlUnwrapper>): UnwrapperIndex => {
  const byHost = new Map<string, Array<UrlUnwrapper>>()
  const rest: Array<UrlUnwrapper> = []
  let domainLength = 0

  for (const unwrap of unwrappers) {
    const hosts = unwrapperHosts.get(unwrap)

    if (!hosts) {
      rest.push(unwrap)

      for (const list of byHost.values()) {
        list.push(unwrap)
      }

      continue
    }

    for (const host of hosts) {
      const list = byHost.get(host)

      if (host.startsWith('.')) {
        domainLength = Math.max(domainLength, host.length)
      }

      if (!list) {
        byHost.set(host, [...rest, unwrap])
        continue
      }

      if (list.at(-1) !== unwrap) {
        list.push(unwrap)
      }
    }
  }

  return { byHost, rest, domainLength }
}

const getUnwrapperIndex = (unwrappers: Array<UrlUnwrapper>): UnwrapperIndex | undefined => {
  if (!unwrapperIndexes.has(unwrappers)) {
    unwrapperIndexes.set(unwrappers, undefined)
    return
  }

  let index = unwrapperIndexes.get(unwrappers)

  if (!index) {
    index = buildUnwrapperIndex(unwrappers)
    unwrapperIndexes.set(unwrappers, index)
  }

  return index
}

const getCandidates = (
  url: URL,
  unwrappers: Array<UrlUnwrapper>,
  index: UnwrapperIndex | undefined,
): Array<UrlUnwrapper> => {
  if (!index) {
    return unwrappers
  }

  const host = normalizeHost(url.hostname)
  const exact = index.byHost.get(host)

  if (!index.domainLength) {
    return exact ?? index.rest
  }

  const suffixLists: Array<Array<UrlUnwrapper>> = []
  let start = host.length

  // Walks the `.domain` suffixes from the right and stops past the longest registered one, so a
  // host with thousands of labels costs as much as its last few.
  while (start !== -1 && host.length - start < index.domainLength) {
    start = start > 0 ? host.lastIndexOf('.', start - 1) : -1

    const list = index.byHost.get(start === -1 ? `.${host}` : host.slice(start))

    if (list) {
      suffixLists.push(list)
    }
  }

  const lists: Array<Array<UrlUnwrapper>> = exact ? [exact] : []

  lists.push(...suffixLists.reverse())

  if (lists.length === 0) {
    return index.rest
  }

  if (lists.length === 1) {
    return lists[0]
  }

  // A host under several registered domains runs their unwrappers merged back into list order.
  const matched = new Set(lists.flat())

  return unwrappers.filter((unwrap) => matched.has(unwrap))
}

const applyUnwrappers = (
  url: URL,
  unwrappers: Array<UrlUnwrapper>,
  index: UnwrapperIndex | undefined,
  matcher: TrackingMatcher,
): string | undefined => {
  for (const unwrap of getCandidates(url, unwrappers, index)) {
    // A trailing no-break space, as YouTube descriptions carry, hides a bare host untrimmed.
    const target = cleanTarget(addTargetScheme(unwrap(url)?.trim()))

    if (target) {
      return target
    }
  }

  // A wrapper written with a doubled slash, `//safety/go`, matches only once collapsed. The url as
  // written goes first, so a target whose own path holds `//` keeps it.
  const collapsed = parseUrl(normalizeUrl(url.href, { collapseSlashes: true }))

  if (collapsed && collapsed.href !== url.href) {
    const target = applyUnwrappers(collapsed, unwrappers, index, matcher)

    if (target) {
      return target
    }
  }

  // A session id in the wrapper's path, `/external-link.jspa;jsessionid=<id>`, hides its exact
  // path. The url as written goes first, so a target carrying a session id keeps it.
  const sessionless = parseUrl(url.href)

  if (sessionless) {
    deleteSessionPathParams(sessionless, matcher)
  }

  if (!sessionless || sessionless.href === url.href) {
    return
  }

  return applyUnwrappers(sessionless, unwrappers, index, matcher)
}

// Apply unwrappers in order and return the first extracted target URL that survives cleaning,
// serialized as in purifyUrl, or undefined when none match or the input cannot be parsed.
export const unwrapUrl = (
  url: string,
  unwrappers: Array<UrlUnwrapper> = defaultUnwrappers,
): string | undefined => {
  const parsed = parseUrl(url)

  if (!parsed) {
    return
  }

  const index = getUnwrapperIndex(unwrappers)
  const matcher = getTrackingMatcher(defaultTrackingParams)
  const target = applyUnwrappers(parsed, unwrappers, index, matcher)

  if (!target) {
    return
  }

  return parseUrl(target)?.href
}

// Remove tracking params, matching names case-insensitively, and return the cleaned URL in the
// URL Standard serialization. Input that cannot be parsed is returned unchanged.
export const stripTrackingParams = (
  url: string,
  trackingParams: Array<TrackingParam> = defaultTrackingParams,
): string => {
  const parsed = parseUrl(url)

  if (!parsed) {
    return url
  }

  deleteTrackingParams(parsed, trackingParams)

  return parsed.href
}

// Answer whether one query pair is tracking on a url with this hostname, as purifyUrl decides it.
// It never sees the path or the other pairs, so a `;name=value` path param, the signature rule and
// the Alibaba DirectMail `ts` rule need purifyUrl. `name` and `value` arrive percent-decoded, as
// purifyUrl decodes them, and `value` is undefined with no `=`.
export const isTrackingParam = (
  name: string,
  value: string | undefined,
  hostname: string,
  trackingParams: Array<TrackingParam> = defaultTrackingParams,
): boolean => {
  const matcher = getTrackingMatcher(trackingParams)
  const url = parseUrl(`https://${hostname}`)
  const pairHost: PairHost = url
    ? getPairHost(url)
    : { host: stripWww(normalizeHost(hostname)), urls: [] }

  return isTrackedPair(matcher, name.toLowerCase(), value ?? '', pairHost)
}

// Unwrap redirect/affiliate wrappers, then strip tracking params, and return the result in the
// URL Standard serialization. Input that cannot be parsed is returned unchanged.
export const purifyUrl = (url: string, options?: PurifyUrlOptions): string => {
  const unwrappers = options?.unwrappers ?? defaultUnwrappers
  const trackingParams = options?.trackingParams ?? defaultTrackingParams
  const maxUnwrapDepth = options?.maxUnwrapDepth ?? 12

  const parsed = parseUrl(url)

  if (!parsed) {
    return url
  }

  const index = getUnwrapperIndex(unwrappers)
  const matcher = getTrackingMatcher(trackingParams)
  let currentParsed = parsed

  // Wrappers can nest (an email gateway wrapping a search redirect), so
  // unwrap repeatedly up to the depth limit.
  for (let depth = 0; depth < maxUnwrapDepth; depth += 1) {
    const target = applyUnwrappers(currentParsed, unwrappers, index, matcher)

    if (!target) {
      break
    }

    const targetParsed = parseUrl(target)

    if (!targetParsed) {
      break
    }

    currentParsed = targetParsed
  }

  deleteTrackingParams(currentParsed, trackingParams)

  return currentParsed.href
}

/** @deprecated Use `purifyUrl` instead. */
export const cleanUrl = purifyUrl
