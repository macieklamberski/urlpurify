import { createParamExtractor } from '../utils.js'

// Travelpayouts affiliate redirect (tp.media/r?u=<target>), on every subdomain.
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapTravelpayouts = createParamExtractor({
  domains: 'tp.media',
  path: '/r',
  params: ['u'],
})
