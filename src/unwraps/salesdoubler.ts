import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const pathRegex = /^\/in\/offer\/\d+$/i

const hosts = ['rdr.salesdoubler.com.ua']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['dlink'],
})

// SalesDoubler affiliate click (rdr.salesdoubler.com.ua/in/offer/<offer
// id>?aid=<id>&dlink=<target>). Not included in defaultUnwrappers: unwrapping drops the publisher's
// commission.
export const unwrapSalesdoubler = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
