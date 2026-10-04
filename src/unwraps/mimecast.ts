import { isHostOrSubdomainOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const mimecastPathRegex = /^\/s\/[^/]+$/

// Mimecast email link protection (<region>.mimecast.com/s/<id>?url=<target> or ?domain=<host>),
// on mimecast.com and every subdomain. The `domain` form lacks a scheme, so we synthesise https.
export const unwrapMimecast: UrlUnwrapper = (url) => {
  if (!isHostOrSubdomainOf(url, 'mimecast.com') || !mimecastPathRegex.test(url.pathname)) {
    return
  }

  const targetUrl = url.searchParams.get('url')
  if (targetUrl) {
    return targetUrl
  }

  const targetDomain = url.searchParams.get('domain')
  if (targetDomain) {
    return `https://${targetDomain}`
  }
}
