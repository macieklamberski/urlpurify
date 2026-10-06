import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/gate\/big5\/([^/]+\.[^/]+(?:\/.*)?)$/

// Xinhua Traditional Chinese conversion proxy (big5.xinhuanet.com/gate/big5/<host>/<path>), with
// the target's scheme dropped. It answers 503 as of 2026-10-06, so only archived feeds carry it.
// Not included in defaultUnwrappers: unwrapping returns the original page, not the converted copy.
export const unwrapXinhuaBig5: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'big5.xinhuanet.com')) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // The proxy rewrites a page's http://<host>/<path> links to gate/big5/<host>/<path>.
  const target = `http://${match[1]}${url.search}${url.hash}`

  if (isHttpUrl(target)) {
    return target
  }
}
