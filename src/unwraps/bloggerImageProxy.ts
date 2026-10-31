import {
  decodePercent,
  getQueryParamValues,
  isHostOf,
  isHostOrSubdomainOf,
  isHttpUrl,
} from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const focusHostRegex = /^(?:images)?\d-focus-opensocial\.googleusercontent\.com$/

// Google gadget image proxy, as Blogger serves it, on three host shapes:
// - images-blogger-opensocial.googleusercontent.com/gadgets/proxy?url=<source>
// - images0-focus-opensocial.googleusercontent.com/gadgets/proxy?url=<source>
// - <any>.gmodules.com/gadgets/proxy?container=<name>&url=<source>
// Not included in defaultUnwrappers: unwrapping swaps the proxied copy for the original image.
export const unwrapBloggerImageProxy: UrlUnwrapper = (url) => {
  if (
    !isHostOf(url, 'images-blogger-opensocial.googleusercontent.com') &&
    !focusHostRegex.test(url.hostname) &&
    !isHostOrSubdomainOf(url, 'gmodules.com')
  ) {
    return
  }

  if (url.pathname !== '/gadgets/proxy') {
    return
  }

  const value = getQueryParamValues(url, 'url', { decodeValues: false }).at(-1)

  if (!value) {
    return
  }

  const source = decodePercent(value)

  // gmodules.com matches on any subdomain, so only an http source tells the proxy apart.
  if (!isHttpUrl(source)) {
    return
  }

  return source
}
