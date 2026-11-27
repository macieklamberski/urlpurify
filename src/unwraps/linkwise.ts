import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/z\/\d+-\d+\/CD\d+\/$/i

// Linkwise affiliate click (go.linkwi.se/z/<program>-<id>/CD<publisher id>/?lnkurl=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapLinkwise = createQueryUnwrapper({
  hosts: ['go.linkwi.se'],
  path: pathRegex,
  params: ['lnkurl'],
})
