import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// The segment after click-auid is the show's id, and the target keeps its scheme.
const clickPrefixRegex = /^\/click-auid\/[^/]+\/(?=https?:\/)/

// Awesound show-notes click counter (awesound.com/click-auid/<show id>/<target>, also on
// click.awesound.com), with the target unencoded in the path. Awesound now answers with a page on
// old.awesound.com instead of forwarding. Not included in defaultUnwrappers: unwrapping removes the
// podcaster's click count.
export const unwrapAwesound: UrlUnwrapper = (url) => {
  if (!isHostOf(url, ['awesound.com', 'click.awesound.com'])) {
    return
  }

  return getPathTarget(url, clickPrefixRegex)
}
