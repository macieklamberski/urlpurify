import { createUnwrapper, readParamTarget } from '../utils.js'

const mimecastPathRegex = /^\/s\/[^/]+$/i

// Mimecast email link protection (protect-<region>.mimecast.com/s/<id>?url=<target> and
// url.<region>.m.mimecastprotect.com/s/<id>?url=<target>).
// The ?domain=<host> form is left wrapped: Mimecast keeps the target's path on its server.
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapMimecast = createUnwrapper({
  subdomains: ['mimecast.com', 'mimecastprotect.com'],
  match:
    /^(?:protect-[a-z]{2,3}\.mimecast\.com|url\.(?:au|ca|de|jer|uk|us|usb|za)\.m\.mimecastprotect\.com)$/,
  unwrap: (url) => {
    if (!mimecastPathRegex.test(url.pathname)) {
      return
    }

    return readParamTarget(url, 'url')
  },
})
