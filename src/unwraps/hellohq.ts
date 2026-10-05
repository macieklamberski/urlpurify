import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// helloHQ newsletter click tracker (f3.hqlabs.de/Helper/LinkHelper.aspx?mailingId=<n>&key=<key>&href=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapHellohq: UrlUnwrapper = createParamExtractor({
  hosts: 'f3.hqlabs.de',
  path: '/Helper/LinkHelper.aspx',
  params: ['href'],
})
