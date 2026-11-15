import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const pathRegex = /^\/pin\/create\/(?:button|link|extension|bookmarklet|scraped)\/?$/i

const hosts = [
  'pinterest.com',
  'www.pinterest.com',
  /^[a-z]{2}\.pinterest\.com$/,
  // Country domains that redirect to the save form on a pinterest.com host.
  'pinterest.at',
  'www.pinterest.at',
  'pinterest.be',
  'www.pinterest.be',
  'pinterest.ca',
  'www.pinterest.ca',
  'pinterest.ch',
  'www.pinterest.ch',
  'pinterest.cl',
  'www.pinterest.cl',
  'pinterest.co',
  'www.pinterest.co',
  'pinterest.co.in',
  'www.pinterest.co.in',
  'pinterest.co.kr',
  'www.pinterest.co.kr',
  'pinterest.co.nz',
  'www.pinterest.co.nz',
  'pinterest.co.uk',
  'www.pinterest.co.uk',
  'pinterest.com.au',
  'www.pinterest.com.au',
  'pinterest.com.ec',
  'www.pinterest.com.ec',
  'pinterest.com.mx',
  'www.pinterest.com.mx',
  'pinterest.com.pe',
  'www.pinterest.com.pe',
  'pinterest.de',
  'www.pinterest.de',
  'pinterest.dk',
  'www.pinterest.dk',
  'pinterest.ec',
  'www.pinterest.ec',
  'pinterest.es',
  'www.pinterest.es',
  'pinterest.fr',
  'www.pinterest.fr',
  'pinterest.hu',
  'www.pinterest.hu',
  'pinterest.id',
  'www.pinterest.id',
  'pinterest.ie',
  'www.pinterest.ie',
  'pinterest.in',
  'www.pinterest.in',
  'pinterest.it',
  'www.pinterest.it',
  'pinterest.jp',
  'www.pinterest.jp',
  'pinterest.kr',
  'www.pinterest.kr',
  'pinterest.mx',
  'www.pinterest.mx',
  'pinterest.nl',
  'www.pinterest.nl',
  'pinterest.nz',
  'www.pinterest.nz',
  'pinterest.pe',
  'www.pinterest.pe',
  'pinterest.ph',
  'www.pinterest.ph',
  'pinterest.pt',
  'www.pinterest.pt',
  'pinterest.ru',
  'www.pinterest.ru',
  'pinterest.se',
  'www.pinterest.se',
  'pinterest.tw',
  'www.pinterest.tw',
]

// Pinterest save button (pinterest.com/pin/create/button/?url=<target>&media=<image>, also
// /link, /extension, /bookmarklet and /scraped, on pinterest.com, www., the two-letter country
// hosts such as fr.pinterest.com and the country domains such as pinterest.co.uk). Opt-in:
// unwrapping returns the shared page, not the pin builder.
export const unwrapPinterestPin: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, pathRegex)) {
    return
  }

  // The `media=` beside it is the image to pin and `description=` is the pin's text.
  return getParamTarget(url, 'url')
}
