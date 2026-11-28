import { createQueryUnwrapper } from '../utils.js'

// ESVA email link protection (urlsand.esvalabs.com/?u=<target>).
// Opt-in: the gateway checks the target when the link is clicked, so unwrapping skips the check the
// recipient's organization put in place.
export const unwrapEsva = createQueryUnwrapper({
  hosts: 'urlsand.esvalabs.com',
  path: '/',
  params: ['u'],
})
