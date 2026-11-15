import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const pathRegex = /^\/pin\/create\/(?:button|link|extension|bookmarklet|scraped)\/?$/i

const hosts = [
  'pinterest.com',
  'www.pinterest.com',
  'www.pinterest.com.au',
  /^[a-z]{2}\.pinterest\.com$/,
]

// Pinterest save button (pinterest.com/pin/create/button/?url=<target>&media=<image>, also
// /link, /extension, /bookmarklet and /scraped, on pinterest.com, www., www.pinterest.com.au and
// the two-letter country hosts such as fr.pinterest.com). Opt-in: unwrapping returns the shared
// page, not the pin builder.
export const unwrapPinterestPin: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, pathRegex)) {
    return
  }

  // The `media=` beside it is the image to pin and `description=` is the pin's text.
  return getParamTarget(url, 'url')
}
