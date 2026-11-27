import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/servlet\/effi\.(?:redir|product)$/i

// Effiliation French affiliate network (track.effiliation.com/servlet/effi.redir?url=<target>,
// also /servlet/effi.product).
export const unwrapEffiliation = createQueryUnwrapper({
  hosts: ['track.effiliation.com'],
  path: pathRegex,
  params: ['url'],
})
