import { decodePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

// The campaign id, a link hash, then the target percent-encoded as one path segment.
const pathRegex = /^\/c\/[0-9a-f-]{36}\/[0-9a-f]{8}\/(?<target>[^/]+)$/i

// Prezly email click tracker (prezlymail.com/c/<campaign id>/<link hash>/<encoded target>).
// Opt-in: unwrapping drops the sender's click count, as with the other email trackers.
export const unwrapPrezly = createUnwrapper({
  hosts: ['prezlymail.com', 'www.prezlymail.com'],
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    return decodePathTarget(match.groups.target)
  },
})
