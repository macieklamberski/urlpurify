// Extracts the wrapped target URL when the given URL matches a known
// redirect or tracking wrapper. Returns undefined when it does not apply.
export type UrlUnwrapper = (url: URL) => string | undefined

// A literal param name (matched case-insensitively) or a pattern tested
// against the lowercased param name. Patterns should be anchored (^...$).
export type TrackingParam = string | RegExp

export type CleanUrlOptions = {
  unwrappers?: Array<UrlUnwrapper>
  trackingParams?: Array<TrackingParam>
  maxUnwrapDepth?: number
}
