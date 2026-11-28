import { createQueryUnwrapper } from '../utils.js'

// Trustwave email security link rewriting (scanmail.trustwave.com/?c=<n>&d=<blob>&u=<target>).
// Opt-in: the gateway checks the target when the link is clicked, so unwrapping skips the check the
// recipient's organization put in place.
export const unwrapTrustwaveScanmail = createQueryUnwrapper({
  hosts: 'scanmail.trustwave.com',
  path: '/',
  params: ['u'],
})
