import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// helloHQ newsletter click tracker on its numbered hosts
// (f<n>.hqlabs.de/Helper/LinkHelper.aspx?mailingId=<id>[&key=<key>]&href=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapHellohq: UrlUnwrapper = createParamExtractor({
  hosts: /^f\d+\.hqlabs\.de$/,
  path: '/Helper/LinkHelper.aspx',
  params: ['href'],
})
