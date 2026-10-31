import { decodePercent, getQueryParamValues, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const dimsPathRegex = /^\/dims\d\/.*$/i

// Brightspot dims image resizer on any host: its own brightspotcdn.com subdomains and the
// publishers' domains (<host>/dims4/<options>/?url=<source>), such as dims.apnews.com.
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapBrightspot: UrlUnwrapper = (url) => {
  if (!dimsPathRegex.test(url.pathname)) {
    return
  }

  const value = getQueryParamValues(url, 'url', { decodeValues: false }).at(-1)

  if (!value) {
    return
  }

  const source = decodePercent(value)

  // On any host, only an http source tells the resizer from another site's /dims4/ path.
  if (!isHttpUrl(source)) {
    return
  }

  return source
}
