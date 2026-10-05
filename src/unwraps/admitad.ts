import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPathRegex = /^\/(?:g|goto)\/[0-9a-z]+\/$/

const extractTarget = createParamExtractor({
  hosts: 'ad.admitad.com',
  params: ['ulp'],
})

// Admitad affiliate click (ad.admitad.com/g/<id>/?ulp=<target>, also /goto/<id>/).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapAdmitad: UrlUnwrapper = (url) => {
  if (!clickPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
