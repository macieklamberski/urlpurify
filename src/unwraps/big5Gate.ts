import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/gate\/big5\/([\w-]+(?:\.[\w-]+)+(?:\/.*)?)$/

// Big5 conversion gate (<host>/gate/big5/<target host>/<path>), with the target's scheme dropped.
// Chinese-language news and government sites run it on their own hosts, such as big5.xinhuanet.com.
// Not included in defaultUnwrappers: unwrapping returns the original page, not the converted copy.
export const unwrapBig5Gate: UrlUnwrapper = (url) => {
  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // The gate rewrites a page's http://<host>/<path> links to gate/big5/<host>/<path>.
  const target = `http://${match[1]}${url.search}${url.hash}`

  if (isHttpUrl(target)) {
    return target
  }
}
