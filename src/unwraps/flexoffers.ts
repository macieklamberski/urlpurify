import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const clickPaths = ['/g.ashx', '/a.ashx']

const hosts = ['track.flexlinkspro.com']

const extractUrl = createQueryUnwrapper({
  hosts,
  params: ['url'],
})

// FlexOffers affiliate click (track.flexlinkspro.com/g.ashx?foid=<id>&url=<target>, also /a.ashx).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapFlexoffers: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, clickPaths)) {
      return
    }

    return extractUrl(url)
  },
})
