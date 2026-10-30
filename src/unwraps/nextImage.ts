import { decodePercent, resolveUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getRawParamValues } from '../utils.js'

// A site with a base path serves the optimizer under it.
const imagePathRegex = /^(?:\/[^/]+)*\/_next\/image$/i

// Next.js image optimizer on any site (<site>/_next/image?url=<source>&w=<width>), the source
// absolute or a path on the site. Next.js reads a raw `+` in the source as a space.
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapNextImage: UrlUnwrapper = (url) => {
  if (!imagePathRegex.test(url.pathname)) {
    return
  }

  const value = getRawParamValues(url, 'url').at(-1)

  if (!value) {
    return
  }

  return resolveUrl(decodePercent(value.replaceAll('+', ' ')), url.origin)
}
