import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const campaignPrefixRegex = /^\/p\/[A-Z0-9]{5}\//

// Arttrack download measurement prefix (arttrk.com/p/<campaign id>/<target>), where the target
// drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapArttrack: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'arttrk.com')) {
    return
  }

  return getPathTarget(url, campaignPrefixRegex)
}
