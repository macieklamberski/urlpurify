import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const pathRegex = /^\/\d+\/[bt]\/\d+$/

const hosts = ['t.cfjump.com']

const extractUrl = createQueryUnwrapper({
  hosts,
  params: ['Url'],
})

// Commission Factory affiliate click (t.cfjump.com/<publisher id>/t/<program id>?Url=<target>,
// also /b/ for a banner click). Not included in defaultUnwrappers: unwrapping drops the
// publisher's commission.
export const unwrapCommissionFactory = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return extractUrl(url)
  },
})
