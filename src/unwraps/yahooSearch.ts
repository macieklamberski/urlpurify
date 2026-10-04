import { decodeSegment, isHostOrSubdomainOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const yahooPathRegex = /^(?:\/[^/]+)*\/RU=([^/]+)\/RK=/
const unencodedTargetRegex = /^(?:\/[^/]+)*\/RU=(https?:\/\/.+?)\/RK=/

// Yahoo Search redirect (r.search.yahoo.com/.../RU=<URL-encoded-target>/RK=...), also with the
// target unencoded (.../RU=<target>/RK=...). Every search.yahoo.com subdomain, such as ri.
export const unwrapYahooSearch: UrlUnwrapper = (url) => {
  if (!isHostOrSubdomainOf(url, 'search.yahoo.com')) {
    return
  }

  const match = url.pathname.match(yahooPathRegex)

  if (match) {
    return decodeSegment(match[1])
  }

  const unencodedMatch = url.pathname.match(unencodedTargetRegex)

  if (unencodedMatch) {
    return unencodedMatch[1]
  }
}
