import { createQueryUnwrapper } from '../utils.js'

// PR Newswire release click tracker (c212.net or edge.prnewswire.com /c/link/?u=<target>).
// Opt-in: unwrapping removes the issuer's click stats from the wire.
export const unwrapPrNewswire = createQueryUnwrapper({
  hosts: ['c212.net', 'www.c212.net', 'edge.prnewswire.com'],
  path: '/c/link/',
  params: ['u'],
  // A tracker nested unencoded in `u` spills its own `u` into this query, so the last one holds
  // the target.
  index: -1,
})
