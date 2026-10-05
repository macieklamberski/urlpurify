import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/redirect\/cpa\/o\/[a-z0-9]{32}\/$/

const extractTarget = createParamExtractor({
  hosts: ['alipromo.com', 'buyeasy.by', 'epnclick.ru', 'gotbest.by', 'shopnow.pub'],
  params: ['to'],
})

// ePN partner network click (shopnow.pub/redirect/cpa/o/<id>/?to=<target>, also alipromo.com,
// buyeasy.by, epnclick.ru and gotbest.by). Not included in defaultUnwrappers: unwrapping drops the
// publisher's commission.
export const unwrapEpn: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
