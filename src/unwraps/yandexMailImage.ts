import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const resizePaths = ['/mailservice', '/orig']

// Yandex image proxy (resize.yandex.net/mailservice?url=<source> or /orig?url=<source>).
// Not included in defaultUnwrappers: unwrapping swaps the proxied copy for the original image.
export const unwrapYandexMailImage: UrlUnwrapper = createQueryUnwrapper({
  hosts: 'resize.yandex.net',
  path: resizePaths,
  params: ['url'],
  index: -1,
  plus: 'keep',
  ignoreLinkFragment: true,
})
