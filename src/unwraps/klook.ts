import { createQueryUnwrapper } from '../utils.js'

// Klook affiliate redirect (affiliate.klook.com/redirect?k_site=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapKlook = createQueryUnwrapper({
  hosts: 'affiliate.klook.com',
  path: '/redirect',
  params: ['k_site'],
  // A link pasted into another one leaves a second `k_site`, and the last holds the clean target.
  index: -1,
})
