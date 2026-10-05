import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const rssPrefixRegex = /^\/rss\/p\//

// Podscribe download measurement prefix (pscrb.fm/rss/p/<target> and
// verifi.podscribe.com/rss/p/<target>), where the target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodscribe: UrlUnwrapper = (url) => {
  if (!isHostOf(url, ['pscrb.fm', 'verifi.podscribe.com'])) {
    return
  }

  return getPathTarget(url, rssPrefixRegex)
}
