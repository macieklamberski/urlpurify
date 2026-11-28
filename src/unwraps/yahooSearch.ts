import { decodePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const hosts = ['r.search.yahoo.com', 'ri.search.yahoo.com', 'chicagotribune.search.yahoo.com']

const yahooPathRegex = /^(?:\/[^/]+)*\/RU=([^/]+)\/RK=/i
const unencodedTargetRegex = /^(?:\/[^/]+)*\/RU=(https?:\/\/.+?)\/RK=/i

// Yahoo Search redirect (r.search.yahoo.com/.../RU=<URL-encoded-target>/RK=...), also with the
// target unencoded (.../RU=<target>/RK=...).
export const unwrapYahooSearch: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const match = url.pathname.match(yahooPathRegex)

    if (match) {
      return decodePathTarget(match[1])
    }

    const unencodedMatch = url.pathname.match(unencodedTargetRegex)

    if (unencodedMatch) {
      return unencodedMatch[1]
    }
  },
})
