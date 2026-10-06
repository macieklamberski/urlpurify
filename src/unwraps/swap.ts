import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const trackPrefixRegex = /^\/track\/[^/]+\//

// Swap download measurement prefix (tracking.swap.fm/track/<show id>/<target>, also on swap.fm),
// where the target drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapSwap: UrlUnwrapper = (url) => {
  if (!isHostOf(url, ['tracking.swap.fm', 'swap.fm'])) {
    return
  }

  return getPathTarget(url, trackPrefixRegex)
}
