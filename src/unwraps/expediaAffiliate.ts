import { createQueryUnwrapper } from '../utils.js'

// Expedia Group affiliate link
// (expedia.com/affiliate?siteid=<id>&landingPage=<target>&camref=<id>). Not included in
// defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapExpediaAffiliate = createQueryUnwrapper({
  hosts: 'expedia.com',
  path: '/affiliate',
  params: ['landingPage'],
})
