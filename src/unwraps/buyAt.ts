import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const pathRegex = /^\/[a-z0-9]+$/

const hosts = ['ticketsus.at']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['DURL'],
})

// buy.at affiliate redirect on a vanity domain (ticketsus.at/<affiliate>?CTY=<id>&DURL=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapBuyAt = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
