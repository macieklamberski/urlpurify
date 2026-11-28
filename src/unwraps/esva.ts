import { createQueryUnwrapper } from '../utils.js'

// ESVA email link protection (urlsand.esvalabs.com/?u=<target>).
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapEsva = createQueryUnwrapper({
  hosts: 'urlsand.esvalabs.com',
  path: '/',
  params: ['u'],
})
