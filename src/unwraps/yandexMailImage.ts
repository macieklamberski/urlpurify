import { decodePercent, getQueryParamValues, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Yandex Mail image proxy (resize.yandex.net/mailservice?url=<source>).
// Not included in defaultUnwrappers: unwrapping swaps the proxied copy for the original image.
export const unwrapYandexMailImage: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'resize.yandex.net') || url.pathname !== '/mailservice') {
    return
  }

  const value = getQueryParamValues(url, 'url', { decodeValues: false }).at(-1)

  if (!value) {
    return
  }

  return decodePercent(value)
}
