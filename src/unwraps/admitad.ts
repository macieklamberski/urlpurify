import { createQueryUnwrapper } from '../utils.js'

const clickPathRegex = /^\/(?:g|goto)\/[0-9a-z]+\/$/i

// Admitad affiliate click (ad.admitad.com/g/<id>/?ulp=<target>, also /goto/<id>/, and
// alitems.com/g/<id>/?ulp=<target>, its AliExpress click domain, and Admitad's other click
// domains such as rzekl.com).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapAdmitad = createQueryUnwrapper({
  hosts: [
    'ad.admitad.com',
    'aflink.ru',
    'www.aflink.ru',
    'alitems.com',
    'www.alitems.com',
    'alitems.site',
    'www.alitems.site',
    'allgrad.site',
    'www.allgrad.site',
    'bednari.com',
    'www.bednari.com',
    'dhwnh.com',
    'www.dhwnh.com',
    'iytlj.com',
    'www.iytlj.com',
    'kjuzv.com',
    'www.kjuzv.com',
    'lenkmio.com',
    'www.lenkmio.com',
    'modato.ru',
    'www.modato.ru',
    'pafutos.com',
    'www.pafutos.com',
    'rzekl.com',
    'www.rzekl.com',
    'tjzuh.com',
    'www.tjzuh.com',
    'xpuvo.com',
    'www.xpuvo.com',
  ],
  path: clickPathRegex,
  params: ['ulp'],
})
