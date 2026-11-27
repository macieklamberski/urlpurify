import { decodePercent, getQueryParamValues, isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const resizePaths = ['/mailservice', '/orig']

// Yandex image proxy (resize.yandex.net/mailservice?url=<source> or /orig?url=<source>).
// Not included in defaultUnwrappers: unwrapping swaps the proxied copy for the original image.
export const unwrapYandexMailImage: UrlUnwrapper = createUnwrapper({
  hosts: 'resize.yandex.net',
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, resizePaths)) {
      return
    }

    const value = getQueryParamValues(url, 'url', { decodeValues: false }).at(-1)

    if (!value) {
      return
    }

    return decodePercent(value)
  },
})
