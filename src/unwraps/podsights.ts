import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const episodePrefixRegex = /^\/e\//

// Podsights download measurement prefix (pdst.fm/e/<target>), where the target often drops its
// scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodsights: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'pdst.fm')) {
    return
  }

  return getPathTarget(url, episodePrefixRegex)
}
