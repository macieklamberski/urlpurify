import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const prefixRegex = /^\/pdcst\/[A-Za-z0-9]+\//

// Cohost download measurement prefix (cohst.app/pdcst/<id>/<target>), where the target drops its
// scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapCohst: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'cohst.app')) {
    return
  }

  return getPathTarget(url, prefixRegex)
}
