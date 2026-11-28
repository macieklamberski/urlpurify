import { readPathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const trackPrefixRegex = /^\/track\/[a-z0-9]+\//i
// Without an id, only a target that keeps its scheme can be told from an id.
const noIdPrefixRegex = /^\/track\/(?=https?:\/)/i

// Chartable download measurement prefix (chtbl.com/track/<id>/<target> and
// chrt.fm/track/<id>/<target>), where the target often drops its scheme, and the same prefix
// without an id (chtbl.com/track/<target>). Chartable closed in December 2024 and both hosts
// answer 404, so a wrapped enclosure no longer plays.
// Opt-in: unwrapping removes the podcaster's download counts.
export const unwrapChartable = createUnwrapper({
  hosts: ['chtbl.com', 'www.chtbl.com', 'chrt.fm', 'www.chrt.fm'],
  unwrap: (url) => {
    return readPathTarget(url, trackPrefixRegex) ?? readPathTarget(url, noIdPrefixRegex)
  },
})
