import { decodePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const pathRegex = /^\/[\w-]+\/(?<target>https?(?:%3A|%253A)(?:%2F|%252F){2}[^/]*)$/i

// Cisco Secure Email link rewriting (secure-web.cisco.com/<token>/<percent-encoded target>).
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapCiscoSecureWeb = createUnwrapper({
  hosts: 'secure-web.cisco.com',
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    // Some links encode the target twice.
    return decodePathTarget(match.groups.target)
  },
})
