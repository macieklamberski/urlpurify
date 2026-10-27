import { decodePercent } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const googleAmpHostRegex = /^(?:www\.)?google\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/
const httpsPathRegex = /^\/amp\/s\/(.+)$/
const httpPathRegex = /^\/amp\/(?!s\/)(.+)$/

// Google AMP viewer (www.google.<TLD>/amp/s/<host>/<path> for https, or
// /amp/<host>/<path> for http). Distinct from the cdn.ampproject.org cache.
export const unwrapGoogleAmpViewer: UrlUnwrapper = (url) => {
  if (!googleAmpHostRegex.test(url.hostname)) {
    return
  }

  const httpsMatch = url.pathname.match(httpsPathRegex)
  const match = httpsMatch ?? url.pathname.match(httpPathRegex)

  if (!match) {
    return
  }

  // The target's own query can be percent-encoded into the path, as in `%3famp`.
  const path = decodePercent(match[1])

  return `${httpsMatch ? 'https' : 'http'}://${path}${url.search}`
}
