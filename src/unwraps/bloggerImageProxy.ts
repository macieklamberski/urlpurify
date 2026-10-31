import { decodePercent, getQueryParamValues, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Blogger image proxy (images-blogger-opensocial.googleusercontent.com/gadgets/proxy?url=<source>).
// Not included in defaultUnwrappers: unwrapping swaps the proxied copy for the original image.
export const unwrapBloggerImageProxy: UrlUnwrapper = (url) => {
  if (
    !isHostOf(url, 'images-blogger-opensocial.googleusercontent.com') ||
    url.pathname !== '/gadgets/proxy'
  ) {
    return
  }

  const value = getQueryParamValues(url, 'url', { decodeValues: false }).at(-1)

  if (!value) {
    return
  }

  return decodePercent(value)
}
