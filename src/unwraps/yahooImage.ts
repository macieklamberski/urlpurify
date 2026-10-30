import { decodePercent, isSubdomainOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const sourcePathRegex = /^\/.*?\/api\/res\/.*?(?<source>https?(?::|%3a).+)$/i

// Yahoo image API (s.yimg.com/<namespace>/api/res/<version>/<options>/<source>).
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapYahooImage: UrlUnwrapper = (url) => {
  if (!isSubdomainOf(url, 'yimg.com')) {
    return
  }

  const source = url.pathname.match(sourcePathRegex)?.groups?.source

  if (!source) {
    return
  }

  return decodePercent(`${source}${url.search}${url.hash}`)
}
