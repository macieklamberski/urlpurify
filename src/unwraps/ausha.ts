import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const episodePrefixRegex = /^\/[A-Za-z0-9]{12}\//

// Ausha download measurement prefix (tr.ausha.co/<episode id>/<target>), where the target drops
// its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapAusha: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'tr.ausha.co')) {
    return
  }

  return getPathTarget(url, episodePrefixRegex)
}
