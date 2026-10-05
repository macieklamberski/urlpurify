import { createParamExtractor } from '../utils.js'

// Hornetsecurity ATP link scan (atpscan.global.hornetsecurity.com/?d=...&f=...&u=<target>).
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapHornetsecurity = createParamExtractor({
  hosts: 'atpscan.global.hornetsecurity.com',
  path: '/',
  params: ['u'],
})
