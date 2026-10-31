import { decodePercent, isSubdomainOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const sourcePathRegex = /^\/dynamic\/image\/.*?(?<source>https?(?::|%3a).+)$/i

// dev.to image optimizer (media2.dev.to/dynamic/image/<options>/<source>).
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapDevToImage: UrlUnwrapper = (url) => {
  if (!isSubdomainOf(url, 'dev.to')) {
    return
  }

  const source = url.pathname.match(sourcePathRegex)?.groups?.source

  if (!source) {
    return
  }

  return decodePercent(`${source}${url.search}${url.hash}`)
}
