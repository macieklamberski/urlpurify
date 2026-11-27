import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// The converter path, then the target host, with a doubled slash or the target's scheme kept.
const tunisPrefixRegex = /^\/tunis\/(?=\/?(?:https?:\/+)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/|$))/i

// Simplified Chinese converter of Hong Kong government and public sites
// (<host>/TuniS/<target host>/<path>), which serves the page converted from Traditional Chinese.
// Each site runs it on a host of its own, such as sc.isd.gov.hk, sc.news.gov.hk or gbcode.rthk.hk.
// Not included in defaultUnwrappers: unwrapping returns the original page, not the converted copy.
export const unwrapHongKongTunis: UrlUnwrapper = (url) => {
  return getPathTarget(url, tunisPrefixRegex)
}
