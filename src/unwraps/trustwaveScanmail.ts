import { createParamExtractor } from '../utils.js'

// Trustwave email security link rewriting (scanmail.trustwave.com/?c=<n>&d=<blob>&u=<target>).
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapTrustwaveScanmail = createParamExtractor({
  hosts: 'scanmail.trustwave.com',
  path: '/',
  params: ['u'],
})
