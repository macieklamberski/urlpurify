import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/[^/]+\/outgoing$/

// DeviantArt outbound link shim (www.deviantart.com/<user>/outgoing?<target>). Only the www host
// redirects: every user has a subdomain of deviantart.com. The target is the whole query string,
// unencoded, so it is taken verbatim.
export const unwrapDeviantartOutgoing: UrlUnwrapper = (url) => {
  if (!isHostOf(url, ['www.deviantart.com', 'deviantart.com']) || !pathRegex.test(url.pathname)) {
    return
  }

  const target = url.search.slice(1)

  if (!target) {
    return
  }

  // The target's own fragment lands in the wrapper's `hash`.
  return `${target}${url.hash}`
}
