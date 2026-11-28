import { createQueryUnwrapper } from '../utils.js'

// FireEye email link protection (protect2.fireeye.com/v1/url?u=<target> or /url?u=<target>).
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapFireeye = createQueryUnwrapper({
  hosts: 'protect2.fireeye.com',
  path: ['/v1/url', '/url'],
  params: ['u'],
})
