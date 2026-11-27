import { createQueryUnwrapper } from '../utils.js'

// FlexOffers affiliate click (track.flexlinkspro.com/g.ashx?foid=<id>&url=<target>, also /a.ashx).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapFlexoffers = createQueryUnwrapper({
  hosts: ['track.flexlinkspro.com'],
  path: ['/g.ashx', '/a.ashx'],
  params: ['url'],
})
