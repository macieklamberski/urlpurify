import { isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const prNewswireHosts = ['c212.net', 'edge.prnewswire.com']
const encodedSchemeRegex = /^https?%3A/i

// PR Newswire release click tracker (c212.net or edge.prnewswire.com /c/link/?u=<target>).
export const unwrapPrNewswire: UrlUnwrapper = (url) => {
  if (!isAnyOf(url.hostname, prNewswireHosts) || url.pathname !== '/c/link/') {
    return
  }

  // A tracker nested unencoded in `u` spills its own `u` into this query, so the last one
  // holds the target.
  let target = url.searchParams.getAll('u').at(-1)

  if (!target) {
    return
  }

  // Some releases encode the target twice.
  if (encodedSchemeRegex.test(target)) {
    try {
      target = decodeURIComponent(target)
    } catch {}
  }

  if (isHttpUrl(target)) {
    return target
  }
}
