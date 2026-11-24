import { createQueryUnwrapper } from '../utils.js'

// Groupon affiliate click (tracking.groupon.com/r?tsToken=<token>&url=<target>, and the
// per-country hosts such as t.groupon.co.uk and t.grouponnz.co.nz). Not included in
// defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapGroupon = createQueryUnwrapper({
  hosts: [
    't.groupon.co.il',
    't.groupon.co.in',
    't.groupon.co.uk',
    't.groupon.it',
    't.groupon.my',
    't.grouponnz.co.nz',
    'tracking.groupon.com',
  ],
  path: '/r',
  params: ['url'],
})
