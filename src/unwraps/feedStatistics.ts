import { decodeBase64, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getDecodedParamTarget } from '../utils.js'

// The blog home, or a WordPress install under up to two path segments, such as /blog/.
const pathRegex = /^\/(?:[^/]+\/){0,2}$/

// Feed Statistics WordPress plugin click counter on any blog
// (<blog home>/?feed-stats-url=<base64 target>&feed-stats-url-post-id=<id>). Each blog runs the
// plugin on its own host.
export const unwrapFeedStatistics: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  const target = getDecodedParamTarget(url, 'feed-stats-url', decodeBase64)

  if (target && isHttpUrl(target)) {
    return target
  }
}
