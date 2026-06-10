import { defaultUnwrappers } from './defaults.js'
import { defaultTrackingParams } from './params.js'
import type { CleanUrlOptions, UrlUnwrapper } from './types.js'

const trackingParamsCache = new WeakMap<Array<string>, Set<string>>()

const getTrackingParamsSet = (params: Array<string>): Set<string> => {
  let cached = trackingParamsCache.get(params)

  if (!cached) {
    cached = new Set(params.map((param) => param.toLowerCase()))
    trackingParamsCache.set(params, cached)
  }

  return cached
}

const parseUrl = (url: string): URL | undefined => {
  try {
    return new URL(url)
  } catch {}
}

// Delete tracking parameters in place, matching names case-insensitively.
// Returns whether anything was removed.
const deleteTrackingParams = (url: URL, trackingParams: Array<string>): boolean => {
  if (!url.search) {
    return false
  }

  const trackingSet = getTrackingParamsSet(trackingParams)
  const keysToDelete: Array<string> = []

  for (const key of url.searchParams.keys()) {
    if (trackingSet.has(key.toLowerCase())) {
      keysToDelete.push(key)
    }
  }

  for (const key of keysToDelete) {
    url.searchParams.delete(key)
  }

  return keysToDelete.length > 0
}

const applyUnwrappers = (url: URL, unwrappers: Array<UrlUnwrapper>): string | undefined => {
  for (const unwrap of unwrappers) {
    const target = unwrap(url)

    if (target) {
      return target
    }
  }
}

// Apply unwrappers in order and return the first extracted target URL, or
// undefined when none match or the input cannot be parsed.
export const unwrapUrl = (
  url: string,
  unwrappers: Array<UrlUnwrapper> = defaultUnwrappers,
): string | undefined => {
  const parsed = parseUrl(url)

  if (!parsed) {
    return
  }

  return applyUnwrappers(parsed, unwrappers)
}

// Remove tracking parameters, matching names case-insensitively, and return
// the cleaned URL string. The input is returned unchanged when nothing
// matches or it cannot be parsed.
export const stripTrackingParams = (
  url: string,
  trackingParams: Array<string> = defaultTrackingParams,
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
  const maxUnwrapDepth = options?.maxUnwrapDepth ?? 3

  const parsed = parseUrl(url)

  if (!parsed) {
    return url
  }

  let currentUrl = url
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

    currentUrl = target
    currentParsed = targetParsed
  }

  if (deleteTrackingParams(currentParsed, trackingParams)) {
    return currentParsed.toString()
  }

  return currentUrl
}
