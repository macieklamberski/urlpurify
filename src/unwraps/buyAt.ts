import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/[a-z0-9]+$/

// buy.at affiliate redirect on a vanity domain (ticketsus.at/<affiliate>?CTY=<id>&DURL=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapBuyAt = createQueryUnwrapper({
  hosts: ['ticketsus.at'],
  path: pathRegex,
  params: ['DURL'],
})
