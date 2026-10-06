import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const accountPrefixRegex = /^\/[a-z0-9]{6}\//

// SoundStack download measurement prefix (enrichment.soundstack.com/<account id>/<target>), where
// the target drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapSoundstack: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'enrichment.soundstack.com')) {
    return
  }

  return getPathTarget(url, accountPrefixRegex)
}
