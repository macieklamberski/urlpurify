import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper, matchPathSource } from '../utils.js'

const sourcePathRegex = /^\/.*?\/api\/res\/.*?(?<source>https?(?::|%(?:25)?3a).+)$/i

// Yahoo image API (s.yimg.com/<namespace>/api/res/<version>/<options>/<source>).
// Opt-in: unwrapping swaps the resized copy for the original image.
export const unwrapYahooImage = createUnwrapper({
  subdomains: 'yimg.com',
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const source = matchPathSource(url.pathname, sourcePathRegex)

    if (!source) {
      return
    }

    return resolvePathTarget(url, source)
  },
})
