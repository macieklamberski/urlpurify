import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const dckPathRegex = /^\/dck\/[0-9a-f]+$/i

// ck.jp.ap.valuecommerce.com/servlet/referral?vc_url=<target>
const extractReferral = createQueryUnwrapper({
  hosts: 'ck.jp.ap.valuecommerce.com',
  path: '/servlet/referral',
  params: ['vc_url'],
})

// atq.ck.valuecommerce.com/servlet/atq/referral?vc_url=<target>
const extractAtqReferral = createQueryUnwrapper({
  hosts: 'atq.ck.valuecommerce.com',
  path: '/servlet/atq/referral',
  params: ['vc_url'],
})

// dalr.valuecommerce.com/dck/<id>?vcurl=<target>
// `ckref` is the publisher's page that carried the link, not the target.
const extractDck = createQueryUnwrapper({
  hosts: 'dalr.valuecommerce.com',
  params: ['vcurl'],
})

// ValueCommerce affiliate redirect, in the three shapes above.
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapValuecommerce = createUnwrapper({
  hosts: ['ck.jp.ap.valuecommerce.com', 'atq.ck.valuecommerce.com', 'dalr.valuecommerce.com'],
  unwrap: (url) => {
    if (dckPathRegex.test(url.pathname)) {
      return extractDck(url)
    }

    return extractReferral(url) ?? extractAtqReferral(url)
  },
})
