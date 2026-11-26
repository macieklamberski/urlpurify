import { decodePercent, isSubdomainOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const sourcePathRegex = /^\/.*?\/api\/res\/.*?(?<source>https?(?::|%3a).+)$/i

// Yahoo image API (s.yimg.com/<namespace>/api/res/<version>/<options>/<source>).
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapYahooImage: UrlUnwrapper = createUnwrapper('yimg.com', isSubdomainOf, (url) => {
  const source = url.pathname.match(sourcePathRegex)?.groups?.source

  if (!source) {
    return
  }

  return decodePercent(`${source}${url.search}${url.hash}`)
})
