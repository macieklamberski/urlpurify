import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const hosts = [
  'tracking.swap.fm',
  'swap.fm',
  'dev.swap.fm',
  'staging.swap.fm',
  'tracking-stage.swap.fm',
]
const trackPrefixRegex = /^\/track\/[^/]+\//

// Swap download measurement prefix (tracking.swap.fm/track/<show id>/<target>, also on swap.fm
// and the dev., staging. and tracking-stage. hosts), where the target drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapSwap: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts)) {
    return
  }

  return getPathTarget(url, trackPrefixRegex)
}
