import { createQueryUnwrapper } from '../utils.js'

// Smart AdServer, now Equativ, ad click
// (<host>.smartadserver.com/click?imgid=<id>&insid=<id>&go=<target>).
// Opt-in: unwrapping removes the click attribution.
export const unwrapSmartAdserver = createQueryUnwrapper({
  subdomains: 'smartadserver.com',
  match: /^(?:www\d+|ww\d+|euw\d+|diff)\.smartadserver\.com$/,
  path: '/click',
  params: ['go'],
})
