import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const episodePrefixRegex = /^\/e\//

// Podcorn, now Audacy Creator Lab, download measurement prefix (pdcn.co/e/<target>), where the
// target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodcorn: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'pdcn.co')) {
    return
  }

  return getPathTarget(url, episodePrefixRegex)
}
