import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

// Yahoo Mail image proxy (ecp.yusercontent.com/mail?url=<source>).
// Not included in defaultUnwrappers: unwrapping swaps the proxied copy for the original image.
export const unwrapYahooMailImage: UrlUnwrapper = createQueryUnwrapper({
  hosts: 'ecp.yusercontent.com',
  path: '/mail',
  params: ['url'],
  index: -1,
  plus: 'keep',
  ignoreLinkFragment: true,
})
