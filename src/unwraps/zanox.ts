import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// Zanox writes an unencoded target between double brackets, so the target's own `&` splits the
// outer query and only the raw query holds the whole target.
const bracketRegex = /[?&]ulp=(?:\[\[|%5B%5B)(.+?)(?:\]\]|%5D%5D)/i

const extractUlp = createParamExtractor({
  hosts: 'ad.zanox.com',
  path: '/ppc/',
  params: ['ULP', 'ulp'],
})

// Zanox affiliate click (ad.zanox.com/ppc/?<ad id>&ULP=<target>, also ulp=, and the deeplink
// form ULP=[[<target>]]). Not included in defaultUnwrappers: unwrapping drops the publisher's
// commission.
export const unwrapZanox: UrlUnwrapper = (url) => {
  const target = extractUlp(url)

  if (!target) {
    return
  }

  const bracketed = url.search.match(bracketRegex)

  if (bracketed) {
    return bracketed[1]
  }

  return target
}
