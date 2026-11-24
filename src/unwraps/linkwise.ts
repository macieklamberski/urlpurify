import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/z\/\d+-\d+\/CD\d+\/$/i

const extractLink = createQueryUnwrapper({
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
