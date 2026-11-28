import { createQueryUnwrapper } from '../utils.js'

// bol.com partner program click (partner.bol.com/click/click?t=url&url=<target>, also on
// partnerprogramma.bol.com and tracking.bol.com).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapBolPartner = createQueryUnwrapper({
  hosts: ['partner.bol.com', 'partnerprogramma.bol.com', 'tracking.bol.com'],
  path: '/click/click',
  params: ['url'],
})
