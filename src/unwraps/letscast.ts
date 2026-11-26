import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const trackPrefixRegex = /^\/track\//i

// LetsCast download measurement prefix (letscast.fm/track/<target>). The target is LetsCast's own
// audio server, such as lc.podcast-hosting.org/<path>, which serves the file itself.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapLetscast: UrlUnwrapper = createUnwrapper('letscast.fm', isHostOf, (url) => {
  return getPathTarget(url, trackPrefixRegex)
})
