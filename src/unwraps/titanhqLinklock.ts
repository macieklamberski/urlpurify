import { createParamExtractor } from '../utils.js'

// TitanHQ LinkLock email link rewriting (linklock.titanhq.com/analyse?url=<target>&data=<blob>).
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapTitanhqLinklock = createParamExtractor({
  hosts: 'linklock.titanhq.com',
  path: '/analyse',
  params: ['url'],
})
