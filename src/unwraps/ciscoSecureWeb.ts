import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { percentDecode } from '../utils.js'

const pathRegex = /^\/[\w-]+\/(https?(?:%3A|%253A)(?:%2F|%252F){2}[^/]*)$/i

// Cisco Secure Email link rewriting (secure-web.cisco.com/<token>/<percent-encoded target>).
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapCiscoSecureWeb: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'secure-web.cisco.com')) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  try {
    let target = decodeURIComponent(match[1])

    // Some links encode the target twice.
    if (!isHttpUrl(target)) {
      target = percentDecode(target)
    }

    if (isHttpUrl(target)) {
      return target
    }
  } catch {}
}
