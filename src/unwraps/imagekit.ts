import { decodePercent, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const sourcePathRegex = /^\/.*?(?<source>https?(?::|%3a).+)$/i

// ImageKit web proxy (ik.imagekit.io/<id>/[tr:<options>/]<source>).
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapImagekit: UrlUnwrapper = createUnwrapper('ik.imagekit.io', isHostOf, (url) => {
  const source = url.pathname.match(sourcePathRegex)?.groups?.source

  if (!source) {
    return
  }

  return decodePercent(`${source}${url.search}${url.hash}`)
})
