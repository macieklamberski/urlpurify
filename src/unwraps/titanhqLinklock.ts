import { createQueryUnwrapper } from '../utils.js'

// TitanHQ LinkLock email link rewriting (linklock.titanhq.com/analyse?url=<target>&data=<blob>).
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapTitanhqLinklock = createQueryUnwrapper({
  hosts: 'linklock.titanhq.com',
  path: '/analyse',
  params: ['url'],
})
