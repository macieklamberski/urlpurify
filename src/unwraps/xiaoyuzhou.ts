import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// The prefix forwards only to media.xyzcdn.net and answers 404 for any other target.
const prefixRegex = /^\/track\/[0-9a-f]{24}\/[0-9a-f]{24}\/(?=media\.xyzcdn\.net\/)/

// Xiaoyuzhou download measurement prefix
// (dts-api.xiaoyuzhoufm.com/track/<show>/<episode>/<target>), where the target drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapXiaoyuzhou: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'dts-api.xiaoyuzhoufm.com')) {
    return
  }

  return getPathTarget(url, prefixRegex)
}
