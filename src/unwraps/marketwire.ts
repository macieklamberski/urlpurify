import { createQueryUnwrapper } from '../utils.js'

// Marketwire release click tracker (ctt.marketwire.com/?release=<id>&id=<id>&type=1&url=<target>).
// Opt-in: unwrapping removes the issuer's click stats from the wire.
export const unwrapMarketwire = createQueryUnwrapper({
  hosts: 'ctt.marketwire.com',
  path: '/',
  params: ['url'],
})
