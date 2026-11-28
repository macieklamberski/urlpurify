import { createQueryUnwrapper } from '../utils.js'

// Smart AdServer, now Equativ, ad click
// (<host>.smartadserver.com/click?imgid=<id>&insid=<id>&go=<target>).
// Opt-in: an ad click pays the publisher.
export const unwrapSmartAdserver = createQueryUnwrapper({
  subdomains: 'smartadserver.com',
  match: /^(?:www\d+|ww\d+|euw\d+|diff)\.smartadserver\.com$/,
  path: '/click',
  params: ['go'],
})
