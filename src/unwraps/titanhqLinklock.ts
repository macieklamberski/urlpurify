import { createQueryUnwrapper } from '../utils.js'

// TitanHQ LinkLock email link rewriting (linklock.titanhq.com/analyse?url=<target>&data=<blob>).
// Opt-in: the gateway checks the target when the link is clicked, so unwrapping skips the check the
// recipient's organization put in place.
export const unwrapTitanhqLinklock = createQueryUnwrapper({
  hosts: 'linklock.titanhq.com',
  path: '/analyse',
  params: ['url'],
})
