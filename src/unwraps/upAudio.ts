import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const prefixRegex = /^\/s\//

// up.audio download measurement prefix (prefix.up.audio/s/<target>), where the target drops its
// scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapUpAudio: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'prefix.up.audio')) {
    return
  }

  return getPathTarget(url, prefixRegex)
}
