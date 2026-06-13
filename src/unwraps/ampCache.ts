import type { UrlUnwrapper } from '../types.js'
import { isHostOf, isSubdomainOf } from '../utils.js'

const httpsPathRegex = /^\/c\/s\/(.+)$/
const httpPathRegex = /^\/c\/(?!s\/)(.+)$/

// AMP cache (cdn.ampproject.org/c/[s/]<hostname>/<path>). The optional
// publisher subdomain is a hint; the path always carries the canonical
// hostname.
export const unwrapAmpCache: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'cdn.ampproject.org') && !isSubdomainOf(url, 'cdn.ampproject.org')) {
    return
  }

  const httpsMatch = url.pathname.match(httpsPathRegex)
  if (httpsMatch) {
    return `https://${httpsMatch[1]}`
  }

  const httpMatch = url.pathname.match(httpPathRegex)
  if (httpMatch) {
    return `http://${httpMatch[1]}`
  }
}
