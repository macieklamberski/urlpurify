import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const mimecastHostRegex = /^protect-[a-z]{2,3}\.mimecast\.com$/
const mimecastProtectHostRegex = /^url\.(?:au|ca|de|jer|uk|us|usb|za)\.m\.mimecastprotect\.com$/
const mimecastPathRegex = /^\/s\/[^/]+$/

// Mimecast email link protection (protect-<region>.mimecast.com/s/<id>?url=<target> or
// ?domain=<host>, and url.<region>.m.mimecastprotect.com/s/<id>?domain=<host>).
// The `domain` form lacks a scheme, so we synthesise https.
export const unwrapMimecast: UrlUnwrapper = (url) => {
  const isMimecastHost =
    mimecastHostRegex.test(url.hostname) || mimecastProtectHostRegex.test(url.hostname)

  if (!isMimecastHost || !mimecastPathRegex.test(url.pathname)) {
    return
  }

  const targetUrl = getParamTarget(url, 'url')
  if (targetUrl) {
    return targetUrl
  }

  const targetDomain = url.searchParams.get('domain')
  if (targetDomain) {
    return `https://${targetDomain}`
  }
}
