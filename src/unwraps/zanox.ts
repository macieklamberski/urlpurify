import { isAnyOf } from 'trousse'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

// Zanox writes an unencoded target between double brackets, so the target's own `&` splits the
// outer query and only the raw query holds the whole target.
const bracketRegex = /[?&]ulp=(?:\[\[|%5B%5B)(?<target>.+?)(?:\]\]|%5D%5D)/i

const hosts = ['ad.zanox.com']

const extractUlp = createQueryUnwrapper({
  hosts,
  path: '/ppc/',
  params: ['ULP', 'ulp'],
})

// Zanox affiliate click (ad.zanox.com/ppc/?<ad id>&ULP=<target>, also ulp=, and the deeplink form
// ULP=[[<target>]]).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapZanox = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/ppc/')) {
      return
    }

    const bracketed = bracketRegex.exec(url.search)

    if (bracketed?.groups) {
      return bracketed.groups.target
    }

    return extractUlp(url)
  },
})
