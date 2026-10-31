import { decodePercent, getQueryParamValues, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Yahoo Mail image proxy (ecp.yusercontent.com/mail?url=<source>).
// Not included in defaultUnwrappers: unwrapping swaps the proxied copy for the original image.
export const unwrapYahooMailImage: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'ecp.yusercontent.com') || url.pathname !== '/mail') {
    return
  }

  const value = getQueryParamValues(url, 'url', { decodeValues: false }).at(-1)

  if (!value) {
    return
  }

  return decodePercent(value)
}
