import { createParamExtractor } from '../utils.js'

// Insider commerce redirect (affiliate.insider.com/?h=<hash>&postID=<id>&u=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapInsiderAffiliate = createParamExtractor({
  hosts: 'affiliate.insider.com',
  path: '/',
  params: ['u'],
})
