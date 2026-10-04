import { createParamExtractor } from '../utils.js'

// Barracuda Email Protection link rewriting (linkprotect.cudasvc.com/url?a=<target>).
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapBarracudaLinkProtect = createParamExtractor({
  hosts: 'linkprotect.cudasvc.com',
  path: '/url',
  params: ['a'],
})
