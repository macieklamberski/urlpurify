import { createParamExtractor } from '../utils.js'

// Moshimo affiliate click (af.moshimo.com/af/c/click?url=<target>, also on c.af.moshimo.com and
// f.moshimo.com).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapMoshimo = createParamExtractor({
  hosts: ['af.moshimo.com', 'c.af.moshimo.com', 'f.moshimo.com'],
  path: '/af/c/click',
  params: ['url'],
})
