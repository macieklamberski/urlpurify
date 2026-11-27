import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getBase64Target } from '../utils.js'

const pathRegex = /^\/api\/v1\/Click\/b\/[A-Za-z0-9]+$/i

// Digikala affiliate click (dgkl.io/api/v1/Click/b/<link id>?b64=<base64 target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapDigikala: UrlUnwrapper = createUnwrapper({
  hosts: 'dgkl.io',
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return getBase64Target(url, 'b64')
  },
})
