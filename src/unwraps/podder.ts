import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const showPrefixRegex = /^\/\d+\//

// Podder download measurement prefix (p.podderapp.com/<show id>/<target>), where the target
// often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodder: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'p.podderapp.com')) {
    return
  }

  return getPathTarget(url, showPrefixRegex)
}
