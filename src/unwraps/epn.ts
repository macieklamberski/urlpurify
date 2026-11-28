import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/redirect\/cpa\/o\/[a-z0-9]{32}\/$/i

// ePN partner network click (shopnow.pub/redirect/cpa/o/<id>/?to=<target>, also alipromo.com,
// buyeasy.by, epnclick.ru and gotbest.by).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapEpn = createQueryUnwrapper({
  hosts: [
    'alipromo.com',
    'www.alipromo.com',
    'buyeasy.by',
    'www.buyeasy.by',
    'epnclick.ru',
    'www.epnclick.ru',
    'gotbest.by',
    'www.gotbest.by',
    'shopnow.pub',
    'www.shopnow.pub',
  ],
  path: pathRegex,
  params: ['to'],
})
