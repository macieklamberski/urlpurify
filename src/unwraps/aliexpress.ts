import { createQueryUnwrapper } from '../utils.js'

// AliExpress Portals affiliate deep link (s.click.aliexpress.com/deep_link.htm?aff_short_key=<id>&
// dl_target_url=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapAliexpress = createQueryUnwrapper({
  hosts: 's.click.aliexpress.com',
  path: '/deep_link.htm',
  params: ['dl_target_url'],
})
