import { decodeSegment, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeEncodedScheme } from '../utils.js'

const hosts = ['r.search.yahoo.com', 'ri.search.yahoo.com', 'chicagotribune.search.yahoo.com']
const yahooPathRegex = /^(?:\/[^/]+)*\/RU=([^/]+)\/RK=/
const unencodedTargetRegex = /^(?:\/[^/]+)*\/RU=(https?:\/\/.+?)\/RK=/

// Yahoo Search redirect (r.search.yahoo.com/.../RU=<URL-encoded-target>/RK=...), also with the
// target unencoded (.../RU=<target>/RK=...).
export const unwrapYahooSearch: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts)) {
    return
  }

  const match = url.pathname.match(yahooPathRegex)

  if (match) {
    const target = decodeSegment(match[1])

    if (!target) {
      return
    }

    return decodeEncodedScheme(target)
  }

  const unencodedMatch = url.pathname.match(unencodedTargetRegex)

  if (unencodedMatch) {
    return unencodedMatch[1]
  }
}
