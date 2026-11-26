import {
  isAnyOf,
  isHostname,
  isHostOf,
  isIpAddress,
  isString,
  normalizeUrl,
  parseUrl,
  resolveUrl,
  stripWww,
} from 'trousse'
import { defaultTrackingParams, defaultUnwrappers } from './defaults.js'
import type { CleanUrlOptions, TrackingEntry, TrackingParam, UrlUnwrapper } from './types.js'
import { unwrapperHosts } from './utils.js'

type TrackingMatcher = {
  literals: Set<string>
  patterns: Array<RegExp>
  entries: Array<TrackingEntry>
}

// A signature covers the rest of the query, so dropping any param from it makes the server reject
// the url, as a CDN answers 401 to a signed file url without its `ts`.
const signatureParams = [
  'sig', // Generic CDN and redirect signature
  'signature', // CloudFront, AWS Signature Version 2
  'x-amz-signature', // AWS Signature Version 4 presigned url
  'x-goog-signature', // Google Cloud Storage V4 signed url
]

const pathParamRegex = /;([^;/=]+)=[^;/]*/g

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

const matchesEntry = (entry: TrackingEntry, name: string, value: string, host: string): boolean => {
  const isNameMatch = isString(entry.name)
    ? // biome-ignore lint/plugin/useAnyOfOrSameText: The caller folds the name once per param, and isAnyOf would fold and trim both sides per entry.
      entry.name.toLowerCase() === name
    : matchesPattern(name, entry.name)

  if (!isNameMatch) {
    return false
  }

  if (entry.hosts instanceof RegExp && !matchesPattern(host, entry.hosts)) {
    return false
  }

  if (Array.isArray(entry.hosts) && !entry.hosts.includes(host)) {
    return false
  }

  if (entry.value instanceof RegExp) {
    return matchesPattern(value, entry.value)
  }

  if (entry.value) {
    return entry.value(value, host)
  }

  return true
}

// Takes the lowercased name, the decoded value and the hostname without `www.`.
const isTrackedPair = (
  matcher: TrackingMatcher,
  name: string,
  value: string,
  host: string,
): boolean => {
  if (matcher.literals.has(name)) {
    return true
  }

  if (matcher.patterns.some((pattern) => matchesPattern(name, pattern))) {
    return true
  }

  return matcher.entries.some((entry) => matchesEntry(entry, name, value, host))
}

// Java servlet containers write the session id into the path, `/page;jsessionid=<id>`.
const deletePathParams = (url: URL, matcher: TrackingMatcher): void => {
  const pathname = url.pathname.replace(pathParamRegex, (param, name: string) => {
    if (matcher.literals.has(name.toLowerCase())) {
      return ''
    }

    return param
  })

  if (pathname !== url.pathname) {
    url.pathname = pathname
  }
}

// Delete tracking params in place, from the query and from `;name=value` path params. Literal
// names match case-insensitively, and patterns are tested against the lowercased name. A url
// whose query carries a signature param is kept whole.
const deleteTrackingParams = (url: URL, trackingParams: Array<TrackingParam>): void => {
  const pairs = url.search.slice(1).split('&')
  const entries = pairs.map((pair) => new URLSearchParams(pair).entries().next().value)

  for (const entry of entries) {
    if (entry && isAnyOf(entry[0], signatureParams)) {
      return
    }
  }

  const matcher = getTrackingMatcher(trackingParams)

  deletePathParams(url, matcher)

  if (!url.search) {
    return
  }

  const host = stripWww(url.hostname)

  // Alibaba DirectMail click urls answer 400 without their `ts` and do not check their `sign`.
  const keepsTs = isHostOf(url, 'dm-cn.aliyuncs.com') && isAnyOf(url.pathname, '/trace/v1/report')

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

    return !isTrackedPair(matcher, name, value, host)
  })

  if (keptPairs.length === pairs.length) {
    return
  }

  url.search = keptPairs.join('&')
}

const controlCharactersRegex = /[\p{Cc}\u2028\u2029]/u
const dottedHostRegex = /[^.]\.[^.]/
const fileExtensionHostRegex = /\.(?:asp|aspx|cgi|htm|html|jsp|jspa|php)$/

// Repairs a scheme such as `http:// https://host` and a host such as `example.com)` through
// `resolveUrl`, then drops a target that is not http, holds a control character or keeps a junk
// host: not a hostname such as `,ccam.cc`, no dot between two labels, or a page extension.
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

  const hostname = parseUrl(repaired)?.hostname ?? ''

  if (!dottedHostRegex.test(hostname) && !isIpAddress(hostname)) {
    return
  }

  if (!isHostname(hostname)) {
    return
  }

  if (fileExtensionHostRegex.test(hostname)) {
    return
  }

  return repaired
}

const protocolRelativeRegex = /^\/\/[^/]/
const bareHostRegex = /^[\p{L}\p{N}-]+(?:\.[\p{L}\p{N}-]+)+(?:[/?#:]|$)/u

// A target without a scheme fails the http check, so it gets `https`: a protocol-relative
// `//host/path`, as Embedly writes for Issuu, and a bare `host.tld/path`, as ShareASale's
// `urllink` and LinkedIn's `safety/go` carry.
const addMissingScheme = (target: string | undefined): string | undefined => {
  if (!target) {
    return
  }

  if (protocolRelativeRegex.test(target)) {
    return `https:${target}`
  }

  if (bareHostRegex.test(target)) {
    return `https://${target}`
  }

  return target
}

type UnwrapperIndex = {
  byHost: Map<string, Array<UrlUnwrapper>>
  rest: Array<UrlUnwrapper>
  hasDomains: boolean
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
  let hasDomains = false

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
        hasDomains = true
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

  return { byHost, rest, hasDomains }
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

  const hostname = url.hostname.toLowerCase()
  const host = hostname.endsWith('.') ? hostname.slice(0, -1) : hostname
  const exact = index.byHost.get(host)

  if (!index.hasDomains) {
    return exact ?? index.rest
  }

  const lists: Array<Array<UrlUnwrapper>> = exact ? [exact] : []
  const labels = host.split('.')

  for (let start = 0; start < labels.length; start++) {
    const list = index.byHost.get(`.${labels.slice(start).join('.')}`)

    if (list) {
      lists.push(list)
    }
  }

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
): string | undefined => {
  for (const unwrap of getCandidates(url, unwrappers, index)) {
    // A trailing no-break space, as YouTube descriptions carry, hides a bare host untrimmed.
    const target = cleanTarget(addMissingScheme(unwrap(url)?.trim()))

    if (target) {
      return target
    }
  }

  // A wrapper written with a doubled slash, `//safety/go`, matches only once collapsed. The url as
  // written goes first, so a target whose own path holds `//` keeps it.
  const collapsed = parseUrl(normalizeUrl(url.href, { collapseSlashes: true }))

  if (!collapsed || collapsed.href === url.href) {
    return
  }

  return applyUnwrappers(collapsed, unwrappers, index)
}

// Apply unwrappers in order and return the first extracted target URL that survives cleaning,
// serialized as in cleanUrl, or undefined when none match or the input cannot be parsed.
export const unwrapUrl = (
  url: string,
  unwrappers: Array<UrlUnwrapper> = defaultUnwrappers,
): string | undefined => {
  const parsed = parseUrl(url)

  if (!parsed) {
    return
  }

  const target = applyUnwrappers(parsed, unwrappers, getUnwrapperIndex(unwrappers))

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

// Answer whether one query pair is tracking on a url with this hostname, as cleanUrl decides it.
// It never sees the path or the other pairs, so a `;name=value` path param, the signature rule and
// the Alibaba DirectMail `ts` rule need cleanUrl. `value` is decoded, or undefined with no `=`.
export const isTrackingParam = (
  name: string,
  value: string | undefined,
  hostname: string,
  trackingParams: Array<TrackingParam> = defaultTrackingParams,
): boolean => {
  const matcher = getTrackingMatcher(trackingParams)
  const host = stripWww(hostname.toLowerCase())

  return isTrackedPair(matcher, name.toLowerCase(), value ?? '', host)
}

// Unwrap redirect/affiliate wrappers, then strip tracking params, and return the result in the
// URL Standard serialization. Input that cannot be parsed is returned unchanged.
export const cleanUrl = (url: string, options?: CleanUrlOptions): string => {
  const unwrappers = options?.unwrappers ?? defaultUnwrappers
  const trackingParams = options?.trackingParams ?? defaultTrackingParams
  const maxUnwrapDepth = options?.maxUnwrapDepth ?? 12

  const parsed = parseUrl(url)

  if (!parsed) {
    return url
  }

  const index = getUnwrapperIndex(unwrappers)
  let currentParsed = parsed

  // Wrappers can nest (an email gateway wrapping a search redirect), so
  // unwrap repeatedly up to the depth limit.
  for (let depth = 0; depth < maxUnwrapDepth; depth += 1) {
    const target = applyUnwrappers(currentParsed, unwrappers, index)

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
