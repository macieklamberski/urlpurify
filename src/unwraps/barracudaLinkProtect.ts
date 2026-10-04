import { createParamExtractor } from '../utils.js'

// Barracuda Email Protection link rewriting (linkprotect.cudasvc.com/url?a=<target>), on
// cudasvc.com and every subdomain.
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapBarracudaLinkProtect = createParamExtractor({
  domains: 'cudasvc.com',
  path: '/url',
  params: ['a'],
})
