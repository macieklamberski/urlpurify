import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const showPrefixRegex = /^\/p\/[^/]+\//i

// SoundOn download measurement prefix (sw.soundon.fm/p/<show id>/<target>), where the target
// often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapSoundOn: UrlUnwrapper = createUnwrapper('sw.soundon.fm', isHostOf, (url) => {
  return getPathTarget(url, showPrefixRegex)
})
