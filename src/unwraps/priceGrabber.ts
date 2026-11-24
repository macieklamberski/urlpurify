import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

// PriceGrabber partner-site click (viglink.pgpartner.com/rd.php?r=<id>&k=<hash>&url=<target>). `k`
// signs the click, not the target. Captures from 2016 show the click forwarding to the merchant.
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapPriceGrabber: UrlUnwrapper = createQueryUnwrapper({
  hosts: 'viglink.pgpartner.com',
  path: '/rd.php',
  params: ['url'],
})
