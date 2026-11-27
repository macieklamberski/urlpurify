import { decodePercent } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const sourcePathRegex = /^\/dynamic\/image\/.*?(?<source>https?(?::|%3a).+)$/i

// dev.to image optimizer (media2.dev.to/dynamic/image/<options>/<source>).
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapDevToImage: UrlUnwrapper = createUnwrapper({
  subdomains: 'dev.to',
  unwrap: (url) => {
    const source = url.pathname.match(sourcePathRegex)?.groups?.source

    if (!source) {
      return
    }

    return decodePercent(`${source}${url.search}${url.hash}`)
  },
})
