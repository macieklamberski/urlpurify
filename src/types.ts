// Extracts the wrapped target URL when the given URL matches a known
// redirect or tracking wrapper. Returns undefined when it does not apply.
export type UrlUnwrapper = (url: URL) => string | undefined

// Answers whether a param's decoded value is tracking, given the url's hostname without `www.`.
export type TrackingValueTest = (value: string, host: string) => boolean

// A param that is tracking only with some values or only on some hosts. `name` matches as a
// literal or pattern does, `value` tests the decoded value, and `hosts` lists exact hostnames
// without `www.` or is a pattern tested against one.
export type TrackingEntry = {
  name: string | RegExp
  value?: RegExp | TrackingValueTest
  hosts?: Array<string> | RegExp
}

// A literal param name (matched case-insensitively), a pattern tested against the lowercased
// param name, or an entry. Patterns should be anchored (^...$).
export type TrackingParam = string | RegExp | TrackingEntry

export type CleanUrlOptions = {
  unwrappers?: Array<UrlUnwrapper>
  trackingParams?: Array<TrackingParam>
  maxUnwrapDepth?: number
}
