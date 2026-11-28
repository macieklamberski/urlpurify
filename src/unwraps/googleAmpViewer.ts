import { decodePercent } from 'trousse'
import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const googleAmpHostRegex = /^(?:www\.)?google\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/
const httpsPathRegex = /^\/amp\/s\/(?<target>.+)$/i
const httpPathRegex = /^\/amp\/(?!s\/)(?<target>.+)$/i

// Google AMP viewer (www.google.<TLD>/amp/s/<host>/<path> for https, or
// /amp/<host>/<path> for http). Distinct from the cdn.ampproject.org cache.
export const unwrapGoogleAmpViewer = createUnwrapper({
  brands: 'google',
  match: googleAmpHostRegex,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const httpsMatch = httpsPathRegex.exec(url.pathname)
    const match = httpsMatch ?? httpPathRegex.exec(url.pathname)

    if (!match?.groups) {
      return
    }

    // The target's own query can be percent-encoded into the path, as in `%3famp`.
    const path = decodePercent(match.groups.target)

    return resolvePathTarget(url, path, httpsMatch ? 'https' : 'http')
  },
})
