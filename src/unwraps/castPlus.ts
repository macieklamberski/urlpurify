import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const showPrefixRegex = /^\/[0-9a-f]{24}\//

// Cast+ download measurement prefix (traffic.cast.plus/<show id>/<target>), where the target
// mostly drops its scheme. The service forwarded such a target to http, even from https.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapCastPlus: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'traffic.cast.plus')) {
    return
  }

  return getPathTarget(url, showPrefixRegex, 'http:')
}
