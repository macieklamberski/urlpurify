import type { UrlUnwrapper } from '../types.js'

// DeviantArt outbound link shim (deviantart.com/<user>/outgoing?<target>). The target is the
// whole query string, unencoded, so it is taken verbatim; only the `/outgoing` path redirects.
export const unwrapDeviantartOutgoing: UrlUnwrapper = (url) => {
  if (!url.hostname.endsWith('deviantart.com') || !url.pathname.endsWith('/outgoing')) {
    return
  }

  return url.search.slice(1) || undefined
}
