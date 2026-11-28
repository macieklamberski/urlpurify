import { createQueryUnwrapper } from '../utils.js'

// Cuelinks affiliate redirect (linksredirect.com/?cid=<id>&url=<target>, also ?pub_id=<id>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapCuelinks = createQueryUnwrapper({
  hosts: ['linksredirect.com', 'www.linksredirect.com'],
  path: '/',
  params: ['url'],
})
