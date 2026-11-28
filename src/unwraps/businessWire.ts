import { createQueryUnwrapper } from '../utils.js'

// Business Wire release click tracker (cts.businesswire.com/ct/CT?url=<target>).
// Opt-in: unwrapping removes the issuer's click stats from the wire.
export const unwrapBusinessWire = createQueryUnwrapper({
  hosts: 'cts.businesswire.com',
  path: '/ct/CT',
  params: ['url'],
})
