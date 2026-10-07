import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const redirectPrefixRegex = /^\/r\//

// Zencastr download measurement prefix (r.zencastr.com/r/<target> and r.zen.ai/r/<target>), where
// the target drops its scheme. Zencastr forwards to https.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapZencastr: UrlUnwrapper = (url) => {
  if (!isHostOf(url, ['r.zencastr.com', 'r.zen.ai'])) {
    return
  }

  return getPathTarget(url, redirectPrefixRegex)
}
