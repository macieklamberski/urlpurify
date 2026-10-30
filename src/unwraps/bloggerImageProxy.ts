import { decodePercent, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getRawParamValues } from '../utils.js'

// Blogger image proxy (images-blogger-opensocial.googleusercontent.com/gadgets/proxy?url=<source>).
// Not included in defaultUnwrappers: unwrapping swaps the proxied copy for the original image.
export const unwrapBloggerImageProxy: UrlUnwrapper = (url) => {
  if (
    !isHostOf(url, 'images-blogger-opensocial.googleusercontent.com') ||
    url.pathname !== '/gadgets/proxy'
  ) {
    return
  }

  const value = getRawParamValues(url, 'url').at(-1)

  if (!value) {
    return
  }

  return decodePercent(value)
}
