import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const mediaPrefixRegex = /^\/media\//i

// Podup download measurement prefix (traffic.podup.com/media/<target>), where the target drops its
// scheme and carries a `key` param holding the show and episode for the download count.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodup: UrlUnwrapper = createUnwrapper('traffic.podup.com', isHostOf, (url) => {
  // Podup forwards to the path alone on https, dropping the query and fragment.
  return getPathTarget(url, mediaPrefixRegex, 'https:', '')
})
