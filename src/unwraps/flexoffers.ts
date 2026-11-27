import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const clickPaths = ['/g.ashx', '/a.ashx']

const extractUrl = createQueryUnwrapper({
  hosts: 'track.flexlinkspro.com',
  params: ['url'],
})

// FlexOffers affiliate click (track.flexlinkspro.com/g.ashx?foid=<id>&url=<target>, also /a.ashx).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapFlexoffers: UrlUnwrapper = (url) => {
  if (!isAnyOf(url.pathname, clickPaths)) {
    return
  }

  return extractUrl(url)
}
