import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const rssPrefixRegex = /^\/rss\/p\//i

// Podscribe download measurement prefix (pscrb.fm/rss/p/<target> and
// verifi.podscribe.com/rss/p/<target>), where the target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodscribe: UrlUnwrapper = createUnwrapper(
  ['pscrb.fm', 'verifi.podscribe.com'],
  isHostOf,
  (url) => {
    return getPathTarget(url, rssPrefixRegex)
  },
)
