import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/(?:[A-Za-z0-9]+|a\/1\/[\w=-]+)$/i

// Symantec Email Security.cloud click-time URL protection
// (clicktime.symantec.com/<token>?u=<target>, also /a/1/<token>=?d=<data>&u=<target>).
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapSymantecClicktime = createQueryUnwrapper({
  hosts: 'clicktime.symantec.com',
  path: pathRegex,
  params: ['u'],
})
