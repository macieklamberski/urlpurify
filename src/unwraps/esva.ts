import { createParamExtractor } from '../utils.js'

// ESVA email link protection (urlsand.esvalabs.com/?u=<target>), on esvalabs.com and every
// subdomain.
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapEsva = createParamExtractor({
  domains: 'esvalabs.com',
  path: '/',
  params: ['u'],
})
