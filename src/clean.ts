import { fixMalformedProtocol, isHttpUrl, isIpAddress, parseUrl, stripWww } from 'trousse'
import { defaultTrackingParams, defaultUnwrappers } from './defaults.js'
import type { CleanUrlOptions, TrackingParam, UrlUnwrapper } from './types.js'

type TrackingMatcher = {
  literals: Set<string>
  patterns: Array<RegExp>
}

const replacementCharacter = '\uFFFD'

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

    for (const param of params) {
      if (param instanceof RegExp) {
        patterns.push(param)
      } else {
        literals.add(param.toLowerCase())
      }
    }

    cached = { literals, patterns }
    trackingMatcherCache.set(params, cached)
  }

  return cached
}

// Delete tracking parameters in place. Literal names match case-insensitively;
// patterns are tested against the lowercased name. A query carrying a signature param is kept whole.
const deleteTrackingParams = (url: URL, trackingParams: Array<TrackingParam>): void => {
  if (!url.search) {
    return
  }

  const pairs = url.search.slice(1).split('&')
  const entries = pairs.map((pair) => new URLSearchParams(pair).entries().next().value)

  for (const entry of entries) {
    if (entry && signatureParams.includes(entry[0].toLowerCase())) {
      return
    }
  }

  const matcher = getTrackingMatcher(trackingParams)
  const host = stripWww(url.hostname)

  // Alibaba DirectMail click urls answer 400 without their `ts` and do not check their `sign`.
  const keepsTs = url.hostname === 'dm-cn.aliyuncs.com' && url.pathname === '/trace/v1/report'

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

    // `search` ignores `lastIndex`, so a caller's `g` or `y` pattern matches on every call.
    if (
      matcher.literals.has(name) ||
      matcher.patterns.some((pattern) => name.search(pattern) !== -1)
    ) {
      return false
    }

    // A `ref` holding the URL's own host is Ghost's self-referral, `?ref=example.com` on
    // example.com. With any other value `ref` is often a real referral target.
    return key !== 'ref' || stripWww(value.toLowerCase()) !== host
  })

  if (keptPairs.length === pairs.length) {
    return
  }

  url.search = keptPairs.join('&')
}

const controlCharactersRegex = /[\p{Cc}\u2028\u2029]/u
const dottedHostRegex = /[^.]\.[^.]/
const fileExtensionHostRegex = /\.(?:asp|aspx|cgi|htm|html|jsp|jspa|php)$/

// Repairs a malformed scheme such as `https:/host` or `https://https://host`, then drops a target
// with a control character or a host without a dot between two labels, so the wrapper stays. Such
// a host is a cut-off link, a path or a scheme read as one: `https://www.`, `https://s3://bucket`.
// A host ending in a page extension is a relative or cut-off link given a scheme, as Gmail writes
// `http:///page.php`, which the scheme repair turns into the host `page.php`.
const cleanTarget = (target: string | undefined): string | undefined => {
  if (!target) {
    return
  }

  const repaired = fixMalformedProtocol(target.trim())

  if (controlCharactersRegex.test(repaired)) {
    return
  }

  const hostname = parseUrl(repaired)?.hostname ?? ''

  if (!dottedHostRegex.test(hostname) && !isIpAddress(hostname)) {
    return
  }

  if (fileExtensionHostRegex.test(hostname)) {
    return
  }

  return repaired
}

const applyUnwrappers = (url: URL, unwrappers: Array<UrlUnwrapper>): string | undefined => {
  for (const unwrap of unwrappers) {
    const target = unwrap(url)

    if (target && isHttpUrl(target)) {
      return target
    }
  }
}

// Apply unwrappers in order and return the first extracted target URL, cleaned and serialized as in
// cleanUrl, or undefined when none match or the input cannot be parsed.
export const unwrapUrl = (
  url: string,
  unwrappers: Array<UrlUnwrapper> = defaultUnwrappers,
): string | undefined => {
  const parsed = parseUrl(url)

  if (!parsed) {
    return
  }

  const target = cleanTarget(applyUnwrappers(parsed, unwrappers))

  // With one hop there is no later hop to drop a part mis-decoded to U+FFFD, so the wrapper stays.
  if (!target || target.includes(replacementCharacter)) {
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

// Unwrap redirect/affiliate wrappers, then strip tracking parameters, and return the result in the
// URL Standard serialization. Input that cannot be parsed is returned unchanged.
export const cleanUrl = (url: string, options?: CleanUrlOptions): string => {
  const unwrappers = options?.unwrappers ?? defaultUnwrappers
  const trackingParams = options?.trackingParams ?? defaultTrackingParams
  const maxUnwrapDepth = options?.maxUnwrapDepth ?? 6

  const parsed = parseUrl(url)

  if (!parsed) {
    return url
  }

  let currentUrl = url
  let currentParsed = parsed
  let intactUrl = url
  let intactParsed = parsed

  // Wrappers can nest (an email gateway wrapping a search redirect), so
  // unwrap repeatedly up to the depth limit.
  for (let depth = 0; depth < maxUnwrapDepth; depth += 1) {
    const target = cleanTarget(applyUnwrappers(currentParsed, unwrappers))

    if (!target) {
      break
    }

    const targetParsed = parseUrl(target)

    if (!targetParsed) {
      break
    }

    currentUrl = target
    currentParsed = targetParsed

    if (!target.includes(replacementCharacter)) {
      intactUrl = target
      intactParsed = targetParsed
    }
  }

  // A target percent-encoded in a legacy charset such as EUC-JP or Shift_JIS decodes to U+FFFD.
  // Fall back to the last hop without one, so a later hop that drops the damaged part still wins.
  if (currentUrl.includes(replacementCharacter)) {
    currentUrl = intactUrl
    currentParsed = intactParsed
  }

  deleteTrackingParams(currentParsed, trackingParams)

  return currentParsed.href
}
