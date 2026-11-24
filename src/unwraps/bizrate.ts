import { createQueryUnwrapper } from '../utils.js'

// Bizrate comparison-shopping redirect (rd.bizrate.com/rd?t=<target>, also on www.bizrate.com).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapBizrate = createQueryUnwrapper({
  hosts: ['rd.bizrate.com', 'www.bizrate.com'],
  path: '/rd',
  params: ['t'],
})
