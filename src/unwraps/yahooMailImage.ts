import { decodePercent, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getRawParamValues } from '../utils.js'

// Yahoo Mail image proxy (ecp.yusercontent.com/mail?url=<source>).
// Not included in defaultUnwrappers: unwrapping swaps the proxied copy for the original image.
export const unwrapYahooMailImage: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'ecp.yusercontent.com') || url.pathname !== '/mail') {
    return
  }

  const value = getRawParamValues(url, 'url').at(-1)

  if (!value) {
    return
  }

  return decodePercent(value)
}
