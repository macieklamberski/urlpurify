import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const showPrefixRegex = /^\/p\/[^/]+\//

// SoundOn download measurement prefix (sw.soundon.fm/p/<show id>/<target>), where the target
// often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapSoundOn: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'sw.soundon.fm')) {
    return
  }

  return getPathTarget(url, showPrefixRegex)
}
