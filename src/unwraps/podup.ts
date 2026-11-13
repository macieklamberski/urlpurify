import { isHostOf, parseUrl } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const mediaPrefixRegex = /^\/media\//i

// Podup download measurement prefix (traffic.podup.com/media/<target>), where the target drops its
// scheme and carries a `key` param holding the show and episode for the download count.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodup: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'traffic.podup.com')) {
    return
  }

  // Podup forwards to the path alone on https, dropping the query and fragment. Clearing them on a
  // copy keeps the host, where resolving the path against the origin reads a path opening on `//`
  // as a new host.
  const pathUrl = parseUrl(url.href)

  if (!pathUrl) {
    return
  }

  pathUrl.search = ''
  pathUrl.hash = ''

  return getPathTarget(pathUrl, mediaPrefixRegex)
}
