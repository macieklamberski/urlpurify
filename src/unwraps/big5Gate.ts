import { isHttpUrl } from 'trousse'
import { resolvePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const pathRegex = /^\/gate\/big5\/([\w-]+(?:\.[\w-]+)+(?:\/.*)?)$/i

// Big5 conversion gate (<host>/gate/big5/<target host>/<path>), with the target's scheme dropped.
// Chinese-language news and government sites run it on their own hosts, such as big5.xinhuanet.com.
// Not included in defaultUnwrappers: unwrapping returns the original page, not the converted copy.
export const unwrapBig5Gate: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.[1]) {
      return
    }

    // The gate rewrites a page's http://<host>/<path> links to gate/big5/<host>/<path>.
    const target = resolvePathTarget(url, match[1], 'http')

    if (isHttpUrl(target)) {
      return target
    }
  },
})
