import { decodeSegment, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const yahooPathRegex = /\/RU=([^/]+)\/RK=/

// Yahoo Search redirect (r.search.yahoo.com/.../RU=<URL-encoded-target>/RK=...).
export const unwrapYahooSearch: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'r.search.yahoo.com')) {
    return
  }

  const match = url.pathname.match(yahooPathRegex)
  if (!match) {
    return
  }

  return decodeSegment(match[1])
}
