import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const pathRegex = /^\/linkclick_\d+_\d+$/i

const hosts = ['go.buybox.click']

const extractUrl = createQueryUnwrapper({
  hosts,
  params: ['url'],
})

// Buybox affiliate click (go.buybox.click/linkclick_<id>_<id>?url=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapBuybox = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return extractUrl(url)
  },
})
