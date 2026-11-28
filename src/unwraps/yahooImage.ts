import { decodePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, matchPathSource } from '../utils.js'

const sourcePathRegex = /^\/.*?\/api\/res\/.*?(?<source>https?(?::|%3a).+)$/i

// Yahoo image API (s.yimg.com/<namespace>/api/res/<version>/<options>/<source>).
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapYahooImage: UrlUnwrapper = createUnwrapper({
  subdomains: 'yimg.com',
  unwrap: (url) => {
    const source = matchPathSource(url.pathname, sourcePathRegex)

    if (!source) {
      return
    }

    return `${decodePathTarget(source)}${url.search}`
  },
})
