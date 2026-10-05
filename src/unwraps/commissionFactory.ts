import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/\d+\/t\/\d+$/

const extractUrl = createParamExtractor({
  hosts: 't.cfjump.com',
  params: ['Url'],
})

// Commission Factory affiliate click (t.cfjump.com/<publisher id>/t/<program id>?Url=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapCommissionFactory: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractUrl(url)
}
