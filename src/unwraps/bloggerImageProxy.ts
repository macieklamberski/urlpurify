import { decodePercent, getQueryParamValues, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const gadgetProxyHosts = [
  'gmodules.com',
  'ig.gmodules.com',
  'images-blogger-opensocial.googleusercontent.com',
  'orkut.gmodules.com',
]
const focusHostRegex = /^(?:images)?\d-focus-opensocial\.googleusercontent\.com$/

// Google gadget image proxy, as Blogger serves it, on three host shapes:
// - images-blogger-opensocial.googleusercontent.com/gadgets/proxy?url=<source>
// - images0-focus-opensocial.googleusercontent.com/gadgets/proxy?url=<source>
// - orkut.gmodules.com/gadgets/proxy?container=<name>&url=<source>
// Not included in defaultUnwrappers: unwrapping swaps the proxied copy for the original image.
export const unwrapBloggerImageProxy: UrlUnwrapper = (url) => {
  if (!isHostOf(url, gadgetProxyHosts) && !focusHostRegex.test(url.hostname)) {
    return
  }

  if (url.pathname !== '/gadgets/proxy') {
    return
  }

  const value = getQueryParamValues(url, 'url', { decodeValues: false }).at(-1)

  if (!value) {
    return
  }

  return decodePercent(value)
}
