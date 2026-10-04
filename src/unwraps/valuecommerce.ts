import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const dckPathRegex = /^\/dck\/[0-9a-f]+$/i

// ck.jp.ap.valuecommerce.com/servlet/referral?vc_url=<target>
const unwrapReferral = createParamExtractor({
  domains: 'valuecommerce.com',
  path: '/servlet/referral',
  params: ['vc_url'],
})

// atq.ck.valuecommerce.com/servlet/atq/referral?vc_url=<target>
const unwrapAtqReferral = createParamExtractor({
  domains: 'valuecommerce.com',
  path: '/servlet/atq/referral',
  params: ['vc_url'],
})

// dalr.valuecommerce.com/dck/<id>?vcurl=<target>
// `ckref` is the publisher's page that carried the link, not the target.
const unwrapDck = createParamExtractor({
  domains: 'valuecommerce.com',
  params: ['vcurl'],
})

// ValueCommerce affiliate redirect, in the three shapes above, on every valuecommerce.com
// subdomain.
export const unwrapValuecommerce: UrlUnwrapper = (url) => {
  if (dckPathRegex.test(url.pathname)) {
    return unwrapDck(url)
  }

  return unwrapReferral(url) ?? unwrapAtqReferral(url)
}
