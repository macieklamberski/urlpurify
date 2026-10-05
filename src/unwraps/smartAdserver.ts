import { createParamExtractor } from '../utils.js'

// Smart AdServer, now Equativ, ad click
// (<host>.smartadserver.com/click?imgid=<id>&insid=<id>&go=<target>). Not included in
// defaultUnwrappers: an ad click pays the publisher.
export const unwrapSmartAdserver = createParamExtractor({
  hosts: /^(?:www\d+|ww\d+|euw\d+|diff)\.smartadserver\.com$/,
  path: '/click',
  params: ['go'],
})
