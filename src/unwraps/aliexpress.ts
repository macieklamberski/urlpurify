import { createParamExtractor } from '../utils.js'

// AliExpress Portals affiliate deep link (s.click.aliexpress.com/deep_link.htm?aff_short_key=<id>&
// dl_target_url=<target>). Not included in defaultUnwrappers: unwrapping drops the publisher's
// commission.
export const unwrapAliexpress = createParamExtractor({
  hosts: 's.click.aliexpress.com',
  path: '/deep_link.htm',
  params: ['dl_target_url'],
})
