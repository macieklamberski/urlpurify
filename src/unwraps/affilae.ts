import { createParamExtractor } from '../utils.js'

// Affilae affiliate click (lb.affilae.com/r/?p=<program id>&af=<id>&lp=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapAffilae = createParamExtractor({
  hosts: 'lb.affilae.com',
  path: '/r/',
  params: ['lp'],
})
