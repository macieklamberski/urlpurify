import { isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getParamTarget } from '../utils.js'

const hosts = ['c212.net', 'edge.prnewswire.com']

// PR Newswire release click tracker (c212.net or edge.prnewswire.com /c/link/?u=<target>).
export const unwrapPrNewswire: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/c/link/')) {
      return
    }

    // A tracker nested unencoded in `u` spills its own `u` into this query, so the last one
    // holds the target.
    const target = getParamTarget(url, 'u', -1)

    if (!target) {
      return
    }

    if (isHttpUrl(target)) {
      return target
    }
  },
})
