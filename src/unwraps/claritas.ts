import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const measurePrefixRegex = /^\/measure\//
const shortPrefixRegex = /^\/m\//

// Claritas download measurement prefix (claritaspod.com/measure/<target>, also on
// www.claritaspod.com, and clrtpod.com/m/<target>), where the target drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapClaritas: UrlUnwrapper = (url) => {
  if (isHostOf(url, ['claritaspod.com', 'www.claritaspod.com'])) {
    return getPathTarget(url, measurePrefixRegex)
  }

  if (isHostOf(url, 'clrtpod.com')) {
    return getPathTarget(url, shortPrefixRegex)
  }
}
