import { decodePercent, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const httpsPathRegex = /^\/amp\/s\/(.+)$/i
const httpPathRegex = /^\/amp\/(?!s\/)(.+)$/i

// Yahoo! JAPAN AMP viewer (search.yahoo.co.jp/amp/s/<host>/<path> for https, or
// /amp/<host>/<path> for http).
export const unwrapYahooJapanAmpViewer: UrlUnwrapper = createUnwrapper({
  hosts: 'search.yahoo.co.jp',
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const httpsMatch = httpsPathRegex.exec(url.pathname)
    const match = httpsMatch ?? httpPathRegex.exec(url.pathname)

    if (!match?.[1]) {
      return
    }

    // The target's own query is percent-encoded into the path, as in `%3Fusqp%3D`.
    const path = decodePercent(match[1])

    const target = `${httpsMatch ? 'https' : 'http'}://${path}${url.search}`

    if (isHttpUrl(target)) {
      return target
    }
  },
})
