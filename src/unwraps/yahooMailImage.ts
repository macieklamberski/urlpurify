import { decodePercent, getQueryParamValues, isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// Yahoo Mail image proxy (ecp.yusercontent.com/mail?url=<source>).
// Not included in defaultUnwrappers: unwrapping swaps the proxied copy for the original image.
export const unwrapYahooMailImage: UrlUnwrapper = createUnwrapper(
  'ecp.yusercontent.com',
  isHostOf,
  (url) => {
    if (!isAnyOf(url.pathname, '/mail')) {
      return
    }

    const value = getQueryParamValues(url, 'url', { decodeValues: false }).at(-1)

    if (!value) {
      return
    }

    return decodePercent(value)
  },
)
