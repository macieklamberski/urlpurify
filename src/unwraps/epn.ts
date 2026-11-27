import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/redirect\/cpa\/o\/[a-z0-9]{32}\/$/i

// ePN partner network click (shopnow.pub/redirect/cpa/o/<id>/?to=<target>, also alipromo.com,
// buyeasy.by, epnclick.ru and gotbest.by). Not included in defaultUnwrappers: unwrapping drops the
// publisher's commission.
export const unwrapEpn = createQueryUnwrapper({
  hosts: ['alipromo.com', 'buyeasy.by', 'epnclick.ru', 'gotbest.by', 'shopnow.pub'],
  path: pathRegex,
  params: ['to'],
})
