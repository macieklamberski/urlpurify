import { createParamExtractor } from '../utils.js'

// DMM and FANZA affiliate link (al.dmm.co.jp, al.dmm.com and al.fanza.co.jp, /?lurl=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapDmmAffiliate = createParamExtractor({
  hosts: /(^|\.)(dmm\.co\.jp|dmm\.com|fanza\.co\.jp)$/,
  path: '/',
  params: ['lurl'],
})
