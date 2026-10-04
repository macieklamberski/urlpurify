import { createParamExtractor } from '../utils.js'

// bol.com partner program click (partner.bol.com/click/click?t=url&url=<target>), on the domain and
// every subdomain.
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapBolPartner = createParamExtractor({
  domains: 'bol.com',
  path: '/click/click',
  params: ['url'],
})
