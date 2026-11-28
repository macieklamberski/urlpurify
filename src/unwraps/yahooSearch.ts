import { decodePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const hosts = ['r.search.yahoo.com', 'ri.search.yahoo.com', 'chicagotribune.search.yahoo.com']

const yahooPathRegex = /^(?:\/[^/]+)*\/RU=(?<target>[^/]+)\/RK=/i
const unencodedTargetRegex = /^(?:\/[^/]+)*\/RU=(?<target>https?:\/\/.+?)\/RK=/i

// Yahoo Search redirect (r.search.yahoo.com/.../RU=<URL-encoded-target>/RK=...), also with the
// target unencoded (.../RU=<target>/RK=...).
export const unwrapYahooSearch = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const match = yahooPathRegex.exec(url.pathname)

    if (match?.groups) {
      return decodePathTarget(match.groups.target)
    }

    const unencodedMatch = unencodedTargetRegex.exec(url.pathname)

    if (unencodedMatch?.groups) {
      return unencodedMatch.groups.target
    }
  },
})
