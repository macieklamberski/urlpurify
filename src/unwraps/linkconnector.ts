import { createQueryUnwrapper } from '../utils.js'

// LinkConnector affiliate click (www.linkconnector.com/ta.php?lc=<id>&url=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapLinkconnector = createQueryUnwrapper({
  hosts: 'www.linkconnector.com',
  path: '/ta.php',
  params: ['url'],
})
