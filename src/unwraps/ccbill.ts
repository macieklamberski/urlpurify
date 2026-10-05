import { createParamExtractor } from '../utils.js'

// CCBill affiliate referral (refer.ccbill.com/cgi-bin/clicks.cgi?CA=<client>&PA=<affiliate>
// &HTML=<target>, also html=<target>). Not in defaultUnwrappers: unwrapping drops the publisher's
// commission.
export const unwrapCcbill = createParamExtractor({
  hosts: ['refer.ccbill.com', 'refer.ash1.ccbill.com'],
  path: '/cgi-bin/clicks.cgi',
  params: ['HTML', 'html'],
})
