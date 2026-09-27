import { isHostOrSubdomainOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// DeviantArt outbound link shim (deviantart.com/<user>/outgoing?<target>). The target is the
// whole query string, unencoded, so it is taken verbatim; only the `/outgoing` path redirects.
export const unwrapDeviantartOutgoing: UrlUnwrapper = (url) => {
  if (!isHostOrSubdomainOf(url, 'deviantart.com') || !url.pathname.endsWith('/outgoing')) {
    return
  }

  const target = url.search.slice(1)

  if (!target) {
    return
  }

  // The target's own fragment lands in the wrapper's `hash`.
  return `${target}${url.hash}`
}
