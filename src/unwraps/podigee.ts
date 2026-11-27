import { decodePercent } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const sourcePathRegex = /^\/.*?(?<source>https?(?::|%3a).+)$/i

// Podigee image resizer for podcast art (images.podigee-cdn.net/<options>/<source>).
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapPodigee: UrlUnwrapper = createUnwrapper({
  subdomains: 'podigee-cdn.net',
  unwrap: (url) => {
    const source = url.pathname.match(sourcePathRegex)?.groups?.source

    if (!source) {
      return
    }

    return decodePercent(`${source}${url.search}${url.hash}`)
  },
})
