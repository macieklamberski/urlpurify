import { decodePercent, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const sourcePathRegex = /^\/.*?(?<source>https?(?::|%3a).+)$/i

// Hatena image scaler (cdn.image.st-hatena.com/image/scale/<signature>/<options>/<source>).
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapHatenaImage: UrlUnwrapper = createUnwrapper(
  'cdn.image.st-hatena.com',
  isHostOf,
  (url) => {
    const source = url.pathname.match(sourcePathRegex)?.groups?.source

    if (!source) {
      return
    }

    return decodePercent(`${source}${url.search}${url.hash}`)
  },
)
