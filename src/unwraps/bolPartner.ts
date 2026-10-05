import { createParamExtractor } from '../utils.js'

// bol.com partner program click (partner.bol.com/click/click?t=url&url=<target>, also on
// partnerprogramma.bol.com and tracking.bol.com).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapBolPartner = createParamExtractor({
  hosts: ['partner.bol.com', 'partnerprogramma.bol.com', 'tracking.bol.com'],
  path: '/click/click',
  params: ['url'],
})
