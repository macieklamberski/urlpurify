import { decodePercent, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getRawParamValues } from '../utils.js'

// Yandex Mail image proxy (resize.yandex.net/mailservice?url=<source>).
// Not included in defaultUnwrappers: unwrapping swaps the proxied copy for the original image.
export const unwrapYandexMailImage: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'resize.yandex.net') || url.pathname !== '/mailservice') {
    return
  }

  const value = getRawParamValues(url, 'url').at(-1)

  if (!value) {
    return
  }

  return decodePercent(value)
}
