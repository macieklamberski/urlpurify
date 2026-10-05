import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64 } from '../utils.js'

const pathRegex = /^\/api\/v1\/Click\/b\/[A-Za-z0-9]+$/

// Digikala affiliate click (dgkl.io/api/v1/Click/b/<link id>?b64=<base64 target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapDigikala: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'dgkl.io') || !pathRegex.test(url.pathname)) {
    return
  }

  const encoded = url.searchParams.get('b64')

  if (!encoded) {
    return
  }

  const target = decodeBase64(encoded)

  if (target && isHttpUrl(target)) {
    return target
  }
}
