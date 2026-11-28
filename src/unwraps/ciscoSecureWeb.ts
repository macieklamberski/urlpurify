import { isHttpUrl } from 'trousse'
import { decodePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const pathRegex = /^\/[\w-]+\/(https?(?:%3A|%253A)(?:%2F|%252F){2}[^/]*)$/i

// Cisco Secure Email link rewriting (secure-web.cisco.com/<token>/<percent-encoded target>).
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapCiscoSecureWeb: UrlUnwrapper = createUnwrapper({
  hosts: 'secure-web.cisco.com',
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.[1]) {
      return
    }

    // Some links encode the target twice.
    const target = decodePathTarget(match[1])

    if (isHttpUrl(target)) {
      return target
    }
  },
})
