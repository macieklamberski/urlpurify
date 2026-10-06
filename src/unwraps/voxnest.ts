import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const streamPrefixRegex = /^\/stream\/[^/]+\//

// Voxnest download measurement prefix (audio.voxnest.com/stream/<show id>/<target>), where the
// target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapVoxnest: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'audio.voxnest.com')) {
    return
  }

  return getPathTarget(url, streamPrefixRegex)
}
