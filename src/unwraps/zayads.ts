import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const campaignPrefixRegex = /^\/[\w-]{22}\//

// ZayAds download measurement prefix (track.zayads.ru/<campaign id>/<target>), where the
// campaign id is 22 base64url characters and the target keeps its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapZayads: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'track.zayads.ru')) {
    return
  }

  return getPathTarget(url, campaignPrefixRegex)
}
