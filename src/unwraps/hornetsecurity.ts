import { createQueryUnwrapper } from '../utils.js'

// Hornetsecurity ATP link scan (atpscan.global.hornetsecurity.com/?d=...&f=...&u=<target>).
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapHornetsecurity = createQueryUnwrapper({
  hosts: 'atpscan.global.hornetsecurity.com',
  path: '/',
  params: ['u'],
})
