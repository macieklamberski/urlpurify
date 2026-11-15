import {
  coerceArray,
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

type TrackingMatcher = {
  literals: Set<string>
  patterns: Array<RegExp>
  entries: Array<TrackingEntry>
}

// A `ref` value with a url delimiter or whitespace is more than a host: `example.com/page` would
// parse to the hostname `example.com`.
const refDelimitersRegex = /[\s/?#\\:@]/

// A signature covers the rest of the query, so dropping any param from it makes the server reject
// the url, as a CDN answers 401 to a signed file url without its `ts`.
const signatureParams = [
  'sig', // Generic CDN and redirect signature
  'signature', // CloudFront, AWS Signature Version 2
  'x-amz-signature', // AWS Signature Version 4 presigned url
  'x-goog-signature', // Google Cloud Storage V4 signed url
]

const trackingMatcherCache = new WeakMap<Array<TrackingParam>, TrackingMatcher>()

const getTrackingMatcher = (params: Array<TrackingParam>): TrackingMatcher => {
  let cached = trackingMatcherCache.get(params)

  if (!cached) {
    const literals = new Set<string>()
    const patterns: Array<RegExp> = []
    const entries: Array<TrackingEntry> = []

    for (const param of params) {
      const isEntry = !isString(param) && !(param instanceof RegExp)

      if (isEntry && (param.value || param.hosts)) {
        entries.push(param)
        continue
      }

      const name = isEntry ? param.name : param

      if (name instanceof RegExp) {
        patterns.push(name)
        continue
      }

      literals.add(name.toLowerCase())
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

const matchesName = (pattern: string | RegExp, name: string): boolean => {
  if (isString(pattern)) {
    return pattern.toLowerCase() === name
  }

  return matchesPattern(name, pattern)
}

const matchesHost = (hosts: TrackingEntry['hosts'], host: string): boolean => {
  if (!hosts) {
    return true
  }

  if (hosts instanceof RegExp) {
    return matchesPattern(host, hosts)
  }

  return coerceArray(hosts).includes(host)
}

const matchesValue = (valueTest: TrackingEntry['value'], value: string, host: string): boolean => {
  if (!valueTest) {
    return true
  }

  if (valueTest instanceof RegExp) {
    return matchesPattern(value, valueTest)
  }

  return valueTest(value, host)
}

const matchesEntry = (entry: TrackingEntry, name: string, value: string, host: string): boolean => {
  return (
    matchesName(entry.name, name) &&
    matchesHost(entry.hosts, host) &&
    matchesValue(entry.value, value, host)
  )
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

// Delete tracking parameters in place. Literal names match case-insensitively, and patterns are
// tested against the lowercased name. A query carrying a signature param is kept whole.
const deleteTrackingParams = (url: URL, trackingParams: Array<TrackingParam>): void => {
  if (!url.search) {
    return
  }

  const pairs = url.search.slice(1).split('&')
  const entries = pairs.map((pair) => new URLSearchParams(pair).entries().next().value)

  for (const entry of entries) {
    if (entry && isAnyOf(entry[0], signatureParams)) {
      return
    }
  }

  const matcher = getTrackingMatcher(trackingParams)
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

    if (isTrackedPair(matcher, name, value, host)) {
      return false
    }

    // A `ref` holding the URL's own host is Ghost's self-referral, `?ref=example.com` on
    // example.com. With any other value `ref` is often a real referral target.
    if (name !== 'ref' || refDelimitersRegex.test(value)) {
      return true
    }

    // The URL parser gives `url.hostname` in lowercase Punycode, so `ref` goes through the same
    // host parsing: `?ref=bücher.example` names `xn--bcher-kva.example`.
    const refUrl = parseUrl(`http://${value}`)

    if (!refUrl) {
      return true
    }

    return stripWww(refUrl.hostname) !== host
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

const applyUnwrappers = (url: URL, unwrappers: Array<UrlUnwrapper>): string | undefined => {
  for (const unwrap of unwrappers) {
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

  return applyUnwrappers(collapsed, unwrappers)
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

  const target = applyUnwrappers(parsed, unwrappers)

  if (!target) {
    return
  }

  return parseUrl(target)?.href
}

// Remove tracking parameters, matching names case-insensitively, and return the cleaned URL in the
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
// A single pair cannot see the rest of the url, so the signature rule and the Alibaba DirectMail
// `ts` rule do not apply. `value` is the decoded value, or undefined for a pair with no `=`.
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

// Unwrap redirect/affiliate wrappers, then strip tracking parameters, and return the result in the
// URL Standard serialization. Input that cannot be parsed is returned unchanged.
export const cleanUrl = (url: string, options?: CleanUrlOptions): string => {
  const unwrappers = options?.unwrappers ?? defaultUnwrappers
  const trackingParams = options?.trackingParams ?? defaultTrackingParams
  const maxUnwrapDepth = options?.maxUnwrapDepth ?? 12

  const parsed = parseUrl(url)

  if (!parsed) {
    return url
  }

  let currentParsed = parsed

  // Wrappers can nest (an email gateway wrapping a search redirect), so
  // unwrap repeatedly up to the depth limit.
  for (let depth = 0; depth < maxUnwrapDepth; depth += 1) {
    const target = applyUnwrappers(currentParsed, unwrappers)

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
