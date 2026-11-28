import { decodePercent } from 'trousse'
import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const httpsPathRegex = /^\/amp\/s\/(?<target>.+)$/i
const httpPathRegex = /^\/amp\/(?!s\/)(?<target>.+)$/i

// Yahoo! JAPAN AMP viewer (search.yahoo.co.jp/amp/s/<host>/<path> for https, or
// /amp/<host>/<path> for http).
export const unwrapYahooJapanAmpViewer = createUnwrapper({
  hosts: 'search.yahoo.co.jp',
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const httpsMatch = httpsPathRegex.exec(url.pathname)
    const match = httpsMatch ?? httpPathRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    // The target's own query is percent-encoded into the path, as in `%3Fusqp%3D`.
    const path = decodePercent(match.groups.target)

    return resolvePathTarget(url, path, httpsMatch ? 'https' : 'http')
  },
})
