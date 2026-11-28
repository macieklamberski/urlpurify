import { createQueryUnwrapper } from '../utils.js'

// FireEye email link protection (protect2.fireeye.com/v1/url?u=<target> or /url?u=<target>).
// Opt-in: the gateway checks the target when the link is clicked, so unwrapping skips the check the
// recipient's organization put in place.
export const unwrapFireeye = createQueryUnwrapper({
  hosts: 'protect2.fireeye.com',
  path: ['/v1/url', '/url'],
  params: ['u'],
})
