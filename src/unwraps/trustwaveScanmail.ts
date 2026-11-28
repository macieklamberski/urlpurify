import { createQueryUnwrapper } from '../utils.js'

// Trustwave email security link rewriting (scanmail.trustwave.com/?c=<n>&d=<blob>&u=<target>).
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapTrustwaveScanmail = createQueryUnwrapper({
  hosts: 'scanmail.trustwave.com',
  path: '/',
  params: ['u'],
})
