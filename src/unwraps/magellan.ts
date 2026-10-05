import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const prefixRegex = /^\/(?:e\/p?\d+|track)\//

// Magellan AI download measurement prefix (mgln.ai/e/<id>/<target> and mgln.ai/track/<target>),
// where the target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapMagellan: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'mgln.ai')) {
    return
  }

  return getPathTarget(url, prefixRegex)
}
