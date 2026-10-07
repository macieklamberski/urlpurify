import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// The segment after r/ is a base64 JSON id naming the site, sermon and media file.
const mediaPrefixRegex = /^\/r\/[^/]+\//

// MinistryCloud sermon media download counter (historian.ministrycloud.com/r/<media id>/<target>),
// where the target mostly keeps its scheme.
// Not included in defaultUnwrappers: unwrapping removes the church's download counts.
export const unwrapMinistryCloud: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'historian.ministrycloud.com')) {
    return
  }

  return getPathTarget(url, mediaPrefixRegex, 'http:')
}
