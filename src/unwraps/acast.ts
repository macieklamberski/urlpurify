import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const flexPrefixRegex = /^\/s\/[^/]+\/u\//

// Acast prefix for shows hosted elsewhere (flex2.acast.com/s/<show>/u/<target>), where the target
// drops its scheme. Acast measures downloads and inserts ads through it.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapAcast: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'flex2.acast.com')) {
    return
  }

  return getPathTarget(url, flexPrefixRegex, url.protocol)
}
