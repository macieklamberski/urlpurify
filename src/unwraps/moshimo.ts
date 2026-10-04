import { createParamExtractor } from '../utils.js'

// Moshimo affiliate click (af.moshimo.com/af/c/click?url=<target>), on moshimo.com and every
// subdomain.
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapMoshimo = createParamExtractor({
  domains: 'moshimo.com',
  path: '/af/c/click',
  params: ['url'],
})
