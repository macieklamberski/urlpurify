import { createQueryUnwrapper } from '../utils.js'

// Barracuda Email Protection link rewriting (linkprotect.cudasvc.com/url?a=<target>).
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapBarracudaLinkProtect = createQueryUnwrapper({
  hosts: 'linkprotect.cudasvc.com',
  path: '/url',
  params: ['a'],
})
