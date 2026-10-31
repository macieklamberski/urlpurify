import { decodePercent } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const jetpackHostRegex = /^i[0-3]\.wp\.com$/
const sourcePathRegex = /^\/(?<source>.+)$/

// Jetpack image CDN (i0.wp.com/<host>/<path>), which drops the source's scheme. Its own query holds
// only resize options. Not included in defaultUnwrappers: unwrapping swaps the resized copy for
// the original image.
export const unwrapJetpack: UrlUnwrapper = (url) => {
  if (!jetpackHostRegex.test(url.hostname)) {
    return
  }

  const source = url.pathname.match(sourcePathRegex)?.groups?.source

  if (!source) {
    return
  }

  return decodePercent(source)
}
