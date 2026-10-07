import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const prefixRegex = /^\/[A-Za-z0-9]+\//

// Vpixl download measurement prefix (pfx.vpixl.com/<id>/<target>), where the target drops its
// scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapVpixl: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'pfx.vpixl.com')) {
    return
  }

  return getPathTarget(url, prefixRegex)
}
