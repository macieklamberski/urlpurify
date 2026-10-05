import { createParamExtractor } from '../utils.js'

// Duomai affiliate click (c.duomai.com/track.php?site_id=<id>&aid=<id>&t=<target>). Not included in
// defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapDuomai = createParamExtractor({
  hosts: 'c.duomai.com',
  path: '/track.php',
  params: ['t'],
})
