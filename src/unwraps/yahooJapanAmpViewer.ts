import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const httpsPathRegex = /^\/amp\/s\/(.+)$/
const httpPathRegex = /^\/amp\/(?!s\/)(.+)$/

// Yahoo! JAPAN AMP viewer (search.yahoo.co.jp/amp/s/<host>/<path> for https, or
// /amp/<host>/<path> for http).
export const unwrapYahooJapanAmpViewer: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'search.yahoo.co.jp')) {
    return
  }

  const httpsMatch = httpsPathRegex.exec(url.pathname)
  const match = httpsMatch ?? httpPathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  let path: string

  // The target's own query is percent-encoded into the path, as in `%3Fusqp%3D`.
  try {
    path = decodeURIComponent(match[1])
  } catch {
    return
  }

  const target = `${httpsMatch ? 'https' : 'http'}://${path}${url.search}`

  if (isHttpUrl(target)) {
    return target
  }
}
