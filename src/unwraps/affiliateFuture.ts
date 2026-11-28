import { createQueryUnwrapper } from '../utils.js'

// AffiliateFuture affiliate click (scripts.affiliatefuture.com/AFClick.asp?affiliateID=<id>&
// merchantID=<id>&url=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapAffiliateFuture = createQueryUnwrapper({
  hosts: 'scripts.affiliatefuture.com',
  path: '/AFClick.asp',
  params: ['url'],
})
