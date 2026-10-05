import type { UrlUnwrapper } from '../types.js'

const mimecastHostRegex = /^protect-[a-z]{2,3}\.mimecast\.com$/
const mimecastPathRegex = /^\/s\/[^/]+$/

// Mimecast email link protection (protect-<region>.mimecast.com/s/<id>?url=<target> or
// ?domain=<host>).
// The `domain` form lacks a scheme, so we synthesise https.
export const unwrapMimecast: UrlUnwrapper = (url) => {
  if (!mimecastHostRegex.test(url.hostname) || !mimecastPathRegex.test(url.pathname)) {
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
