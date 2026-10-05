import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPaths = ['/g.ashx', '/a.ashx']

const extractUrl = createParamExtractor({
  hosts: 'track.flexlinkspro.com',
  params: ['url'],
})

// FlexOffers affiliate click (track.flexlinkspro.com/g.ashx?foid=<id>&url=<target>, also /a.ashx).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapFlexoffers: UrlUnwrapper = (url) => {
  if (!clickPaths.includes(url.pathname)) {
    return
  }

  return extractUrl(url)
}
