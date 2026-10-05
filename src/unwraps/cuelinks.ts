import { createParamExtractor } from '../utils.js'

// Cuelinks affiliate redirect (linksredirect.com/?cid=<id>&url=<target>, also ?pub_id=<id>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapCuelinks = createParamExtractor({
  hosts: 'linksredirect.com',
  path: '/',
  params: ['url'],
})
