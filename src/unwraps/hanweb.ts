import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { appendLinkFragment } from '../utils.js'

// The converter path, then the target host, with a doubled slash or the target's scheme kept.
const tunisPrefixRegex = /^\/tunis\/(?=\/?(?:https?:\/+)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/|$))/i

// HanWEB Simplified Chinese converter (<host>[:<port>]/TuniS/<target host>/<path>), which serves
// a page converted from Traditional Chinese. Hong Kong government and public sites run it on a
// host of their own, such as sc.isd.gov.hk, sc.news.gov.hk or gbcode.rthk.hk.
// Not included in defaultUnwrappers: unwrapping returns the original page, not the converted copy.
export const unwrapHanweb: UrlUnwrapper = (url) => {
  const target = getPathTarget(url, tunisPrefixRegex)

  if (!target) {
    return
  }

  return appendLinkFragment(target, url)
}
