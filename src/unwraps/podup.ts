import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const mediaPrefixRegex = /^\/media\//

// Podup download measurement prefix (traffic.podup.com/media/<target>), where the target drops its
// scheme and carries a `key` param holding the show and episode for the download count.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodup: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'traffic.podup.com')) {
    return
  }

  // Podup forwards to the path alone on https, dropping the query and fragment.
  const pathUrl = new URL(url.pathname, url.origin)

  return getPathTarget(pathUrl, mediaPrefixRegex)
}
