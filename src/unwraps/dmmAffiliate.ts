import { createParamExtractor } from '../utils.js'

// DMM and FANZA affiliate link (al.dmm.co.jp, al.dmm.com and al.fanza.co.jp, /?lurl=<target>), on
// each domain and every subdomain.
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapDmmAffiliate = createParamExtractor({
  domains: ['dmm.co.jp', 'dmm.com', 'fanza.co.jp'],
  path: '/',
  params: ['lurl'],
})
