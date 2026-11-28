import { createQueryUnwrapper } from '../utils.js'

// Fiverr affiliate redirect (go.fiverr.com/visit/?bta=<id>&landingPage=<target>, also
// track.fiverr.com).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapFiverr = createQueryUnwrapper({
  hosts: ['go.fiverr.com', 'track.fiverr.com'],
  path: '/visit/',
  params: ['landingPage'],
})
