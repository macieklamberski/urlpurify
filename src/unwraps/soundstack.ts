import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const accountPrefixRegex = /^\/[a-z0-9]{6}\//

// SoundStack download measurement prefix (enrichment.soundstack.com/<account id>/<target>), where
// the target drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapSoundstack: UrlUnwrapper = createUnwrapper(
  'enrichment.soundstack.com',
  isHostOf,
  (url) => {
    return getPathTarget(url, accountPrefixRegex)
  },
)
