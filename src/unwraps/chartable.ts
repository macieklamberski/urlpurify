import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const trackPrefixRegex = /^\/track\/[a-z0-9]+\//i

// Chartable download measurement prefix (chtbl.com/track/<id>/<target> and
// chrt.fm/track/<id>/<target>), where the target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapChartable: UrlUnwrapper = (url) => {
  if (!isHostOf(url, ['chtbl.com', 'chrt.fm'])) {
    return
  }

  return getPathTarget(url, trackPrefixRegex)
}
