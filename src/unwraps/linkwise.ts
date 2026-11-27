import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const pathRegex = /^\/z\/\d+-\d+\/CD\d+\/$/i

const hosts = ['go.linkwi.se']

const extractLink = createQueryUnwrapper({
  hosts,
  params: ['lnkurl'],
})

// Linkwise affiliate click (go.linkwi.se/z/<program>-<id>/CD<publisher id>/?lnkurl=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapLinkwise = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return extractLink(url)
  },
})
