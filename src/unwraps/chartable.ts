import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const trackPrefixRegex = /^\/track\/[a-z0-9]+\//i
// Without an id, only a target that keeps its scheme can be told from an id.
const noIdPrefixRegex = /^\/track\/(?=https?:\/)/i

// Chartable download measurement prefix (chtbl.com/track/<id>/<target> and
// chrt.fm/track/<id>/<target>), where the target often drops its scheme, and the same prefix
// without an id (chtbl.com/track/<target>). Chartable closed in December 2024 and both hosts
// answer 404, so a wrapped enclosure no longer plays.
export const unwrapChartable: UrlUnwrapper = (url) => {
  if (!isHostOf(url, ['chtbl.com', 'chrt.fm'])) {
    return
  }

  return getPathTarget(url, trackPrefixRegex) ?? getPathTarget(url, noIdPrefixRegex)
}
