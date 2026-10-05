import { createParamExtractor } from '../utils.js'

// Bizrate comparison-shopping redirect (rd.bizrate.com/rd?t=<target>, also on www.bizrate.com).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapBizrate = createParamExtractor({
  hosts: ['rd.bizrate.com', 'www.bizrate.com'],
  path: '/rd',
  params: ['t'],
})
