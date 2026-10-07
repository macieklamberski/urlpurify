import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const showPrefixRegex = /^\/[0-9a-f]{6}\//

// Podroll download measurement prefix (pdrl.fm/<show id>/<target>, also on rss.pdrl.fm), where the
// target drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodroll: UrlUnwrapper = (url) => {
  if (!isHostOf(url, ['pdrl.fm', 'rss.pdrl.fm'])) {
    return
  }

  return getPathTarget(url, showPrefixRegex, url.protocol)
}
