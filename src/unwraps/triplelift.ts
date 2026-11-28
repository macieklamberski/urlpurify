import { createQueryUnwrapper } from '../utils.js'

// TripleLift native ad click (eb2.3lift.com/pass?tl_clickthrough=true&redir=<target>).
// Opt-in: unwrapping removes the click attribution.
export const unwrapTriplelift = createQueryUnwrapper({
  hosts: 'eb2.3lift.com',
  path: '/pass',
  params: ['redir'],
})
