import { createQueryUnwrapper } from '../utils.js'

// LinkConnector affiliate click (www.linkconnector.com/ta.php?lc=<id>&url=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapLinkconnector = createQueryUnwrapper({
  hosts: ['linkconnector.com', 'www.linkconnector.com'],
  path: '/ta.php',
  params: ['url'],
})
