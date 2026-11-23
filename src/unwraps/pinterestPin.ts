import { isAnyOf, isBrandDomainOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const pathRegex = /^\/pin\/create\/(?:button|link|extension|bookmarklet|scraped)\/?$/i

// Pinterest save button (pinterest.com/pin/create/button/?url=<target>&media=<image>, also
// /link, /extension, /bookmarklet and /scraped, on pinterest.com, www., the two-letter country
// hosts such as fr.pinterest.com and the country domains such as pinterest.co.uk). Opt-in:
// unwrapping returns the shared page, not the pin builder.
export const unwrapPinterestPin: UrlUnwrapper = (url) => {
  if (!isBrandDomainOf(url, 'pinterest') || !isAnyOf(url.pathname, pathRegex)) {
    return
  }

  // The `media=` beside it is the image to pin and `description=` is the pin's text.
  return getParamTarget(url, 'url')
}
