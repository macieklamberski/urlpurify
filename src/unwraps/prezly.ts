import { decodePercent, isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// The campaign id, a link hash, then the target percent-encoded as one path segment.
const pathRegex = /^\/c\/[0-9a-f-]{36}\/[0-9a-f]{8}\/([^/]+)$/i

// Prezly email click tracker (prezlymail.com/c/<campaign id>/<link hash>/<encoded target>).
// Opt-in: unwrapping drops the sender's click count, as with the other email trackers.
export const unwrapPrezly: UrlUnwrapper = createUnwrapper('prezlymail.com', isHostOf, (url) => {
  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  const target = decodePercent(match[1])

  if (isHttpUrl(target)) {
    return target
  }
})
