import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const redirectPrefixRegex = /^\/r\//i

// Zencastr download measurement prefix (r.zencastr.com/r/<target> and r.zen.ai/r/<target>), where
// the target drops its scheme. Zencastr forwards to https.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapZencastr: UrlUnwrapper = createUnwrapper(
  ['r.zencastr.com', 'r.zen.ai'],
  isHostOf,
  (url) => {
    return getPathTarget(url, redirectPrefixRegex)
  },
)
