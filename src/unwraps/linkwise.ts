import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/z\/\d+-\d+\/CD\d+\/$/

const extractLink = createParamExtractor({
  hosts: 'go.linkwi.se',
  params: ['lnkurl'],
})

// Linkwise affiliate click (go.linkwi.se/z/<program>-<id>/CD<publisher id>/?lnkurl=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapLinkwise: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractLink(url)
}
