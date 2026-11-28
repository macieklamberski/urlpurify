import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/servlet\/effi\.(?:redir|product)$/i

// Effiliation French affiliate network (track.effiliation.com/servlet/effi.redir?url=<target>,
// also /servlet/effi.product).
// Opt-in: unwrapping removes the publisher's commission.
export const unwrapEffiliation = createQueryUnwrapper({
  hosts: 'track.effiliation.com',
  path: pathRegex,
  params: ['url'],
})
