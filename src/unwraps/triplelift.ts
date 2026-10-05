import { createParamExtractor } from '../utils.js'

// TripleLift native ad click (eb2.3lift.com/pass?tl_clickthrough=true&redir=<target>).
// Not included in defaultUnwrappers: an ad click pays the publisher.
export const unwrapTriplelift = createParamExtractor({
  hosts: 'eb2.3lift.com',
  path: '/pass',
  params: ['redir'],
})
