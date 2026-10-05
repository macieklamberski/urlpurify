import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/[a-z0-9]+$/

const extractTarget = createParamExtractor({
  hosts: 'ticketsus.at',
  params: ['DURL'],
})

// buy.at affiliate redirect on a vanity domain (ticketsus.at/<affiliate>?CTY=<id>&DURL=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapBuyAt: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
