import { createParamExtractor } from '../utils.js'

// Bizrate comparison-shopping redirect (rd.bizrate.com/rd?t=<target>) on bizrate.com and its
// subdomains.
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapBizrate = createParamExtractor({
  domains: 'bizrate.com',
  path: '/rd',
  params: ['t'],
})
