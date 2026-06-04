// Extracts the wrapped target URL when the given URL matches a known
// redirect or tracking wrapper. Returns undefined when it does not apply.
export type UrlUnwrapper = (url: URL) => string | undefined

export type CleanUrlOptions = {
  unwrappers?: Array<UrlUnwrapper>
  trackingParams?: Array<string>
  maxUnwrapDepth?: number
}
