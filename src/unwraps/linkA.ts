import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const productLinkPathRegex = /^\/click_product_link\/[0-9a-f]+\/[0-9a-f]+\/?$/

const extractGateTarget = createParamExtractor({
  hosts: 'link-a.net',
  path: '/gate.php',
  params: ['mallurl1'],
})

const extractProductLinkTarget = createParamExtractor({
  hosts: 'cl.link-ag.net',
  params: ['redirect_url'],
})

// Link-A affiliate click (link-a.net/gate.php?...&mallurl1=<target>, and
// cl.link-ag.net/click_product_link/<id>/<id>?redirect_url=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapLinkA: UrlUnwrapper = (url) => {
  if (productLinkPathRegex.test(url.pathname)) {
    return extractProductLinkTarget(url)
  }

  return extractGateTarget(url)
}
