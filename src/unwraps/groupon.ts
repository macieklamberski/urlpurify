import { createParamExtractor } from '../utils.js'

// Groupon affiliate click (tracking.groupon.com/r?tsToken=<token>&url=<target>, and the
// t.groupon.<country> hosts). Not included in defaultUnwrappers: unwrapping drops the publisher's
// commission.
export const unwrapGroupon = createParamExtractor({
  hosts: [
    't.groupon.co.il',
    't.groupon.co.in',
    't.groupon.co.uk',
    't.groupon.it',
    't.groupon.my',
    'tracking.groupon.com',
  ],
  path: '/r',
  params: ['url'],
})
