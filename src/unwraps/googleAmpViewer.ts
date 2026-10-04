import type { UrlUnwrapper } from '../types.js'

const googleAmpHostRegex = /(?:^|\.)google\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/
const httpsPathRegex = /^\/amp\/s\/(.+)$/
const httpPathRegex = /^\/amp\/(?!s\/)(.+)$/

// Google AMP viewer (www.google.<TLD>/amp/s/<host>/<path> for https, or /amp/<host>/<path> for
// http), on google.<TLD> and every subdomain. Distinct from the cdn.ampproject.org cache.
export const unwrapGoogleAmpViewer: UrlUnwrapper = (url) => {
  if (!googleAmpHostRegex.test(url.hostname)) {
    return
  }

  const httpsMatch = url.pathname.match(httpsPathRegex)
  if (httpsMatch) {
    return `https://${httpsMatch[1]}${url.search}`
  }

  const httpMatch = url.pathname.match(httpPathRegex)
  if (httpMatch) {
    return `http://${httpMatch[1]}${url.search}`
  }
}
