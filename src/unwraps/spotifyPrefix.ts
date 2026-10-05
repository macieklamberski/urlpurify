import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const episodePrefixRegex = /^\/e\//

// Spotify download measurement prefix (prfx.byspotify.com/e/<target>), where the target often
// drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapSpotifyPrefix: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'prfx.byspotify.com')) {
    return
  }

  return getPathTarget(url, episodePrefixRegex)
}
