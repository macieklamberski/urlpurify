import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const mimecastHostRegex = /^protect-[a-z]{2,3}\.mimecast\.com$/
const mimecastProtectHostRegex = /^url\.(?:au|ca|de|jer|uk|us|usb|za)\.m\.mimecastprotect\.com$/
const mimecastPathRegex = /^\/s\/[^/]+$/

// Mimecast email link protection (protect-<region>.mimecast.com/s/<id>?url=<target> and
// url.<region>.m.mimecastprotect.com/s/<id>?url=<target>).
// The ?domain=<host> form is left wrapped: Mimecast keeps the target's path on its server.
export const unwrapMimecast: UrlUnwrapper = (url) => {
  const isMimecastHost =
    mimecastHostRegex.test(url.hostname) || mimecastProtectHostRegex.test(url.hostname)

  if (!isMimecastHost || !mimecastPathRegex.test(url.pathname)) {
    return
  }

  return getParamTarget(url, 'url')
}
