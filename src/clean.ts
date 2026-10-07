import { fixMalformedProtocol, isHttpUrl, isIpAddress, parseUrl, stripWww } from 'trousse'
import { defaultTrackingParams, defaultUnwrappers } from './defaults.js'
import type { CleanUrlOptions, TrackingParam, UrlUnwrapper } from './types.js'

type TrackingMatcher = {
  literals: Set<string>
  patterns: Array<RegExp>
}

const replacementCharacter = '\uFFFD'

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
// patterns are tested against the lowercased name. Returns whether anything
// was removed.
const deleteTrackingParams = (url: URL, trackingParams: Array<TrackingParam>): boolean => {
  if (!url.search) {
    return false
  }

  const matcher = getTrackingMatcher(trackingParams)
  const host = stripWww(url.hostname)
  const pairs = url.search.slice(1).split('&')

  // Kept pairs stay byte-for-byte: re-serializing through URLSearchParams turns
  // `%20` into `+`, `flag` into `flag=` and escapes `;`, which servers can read differently.
  const keptPairs = pairs.filter((pair) => {
    const entry = new URLSearchParams(pair).entries().next().value

    if (!entry) {
      return true
    }

    const [key, value] = entry
    const name = key.toLowerCase()

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
    return false
  }

  url.search = keptPairs.join('&')

  return true
}

const controlCharactersRegex = /[\p{Cc}\u2028\u2029]/u
const dottedHostRegex = /[^.]\.[^.]/
const fileExtensionHostRegex = /\.(?:asp|aspx|cgi|htm|html|jsp|jspa|php)$/

// Repairs a malformed scheme such as `https:/host` or `https://https://host`, then drops a target
// with a control character or a host without a dot between two labels, so the wrapper stays. Such
// a host is a cut-off link, a path or a scheme read as one: `https://www.`, `https://s3://bucket`.
// A host ending in a page extension is a relative link given a scheme, as Gmail writes
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

// Apply unwrappers in order and return the first extracted target URL, cleaned as in cleanUrl, or
// undefined when none match or the input cannot be parsed.
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
  if (target?.includes(replacementCharacter)) {
    return
  }

  return target
}

// Remove tracking parameters, matching names case-insensitively, and return
// the cleaned URL string. The input is returned unchanged when nothing
// matches or it cannot be parsed.
export const stripTrackingParams = (
  url: string,
  trackingParams: Array<TrackingParam> = defaultTrackingParams,
): string => {
  const parsed = parseUrl(url)

  if (!parsed) {
    return url
  }

  if (deleteTrackingParams(parsed, trackingParams)) {
    return parsed.toString()
  }

  return url
}

// Unwrap redirect/affiliate wrappers, then strip tracking parameters. When
// nothing applies or the input cannot be parsed, the input string is returned
// unchanged, so the result is always safe to display.
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

  if (deleteTrackingParams(currentParsed, trackingParams)) {
    return currentParsed.toString()
  }

  return currentUrl
}
