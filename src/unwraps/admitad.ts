import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPathRegex = /^\/(?:g|goto)\/[0-9a-z]+\/$/

const extractTarget = createParamExtractor({
  hosts: [
    'ad.admitad.com',
    'aflink.ru',
    'alitems.com',
    'alitems.site',
    'allgrad.site',
    'bednari.com',
    'dhwnh.com',
    'iytlj.com',
    'kjuzv.com',
    'lenkmio.com',
    'modato.ru',
    'pafutos.com',
    'rzekl.com',
    'tjzuh.com',
    'xpuvo.com',
  ],
  params: ['ulp'],
})

// Admitad affiliate click (ad.admitad.com/g/<id>/?ulp=<target>, also /goto/<id>/, and
// alitems.com/g/<id>/?ulp=<target>, its AliExpress click domain, and Admitad's other click
// domains such as rzekl.com).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapAdmitad: UrlUnwrapper = (url) => {
  if (!clickPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
