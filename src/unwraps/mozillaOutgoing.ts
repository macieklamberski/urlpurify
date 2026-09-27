import { decodeSegment, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/v1\/[0-9a-f]{64}\/(.+)$/

const mozillaOutgoingHosts = [
  'outgoing.prod.mozaws.net',
  'prod.outgoing.prod.webservices.mozgcp.net',
]

// Mozilla outgoing-link redirector used on Mozilla mailing lists, blogs, and
// support forums. Path: /v1/<sha256>/<URL-encoded-target>
export const unwrapMozillaOutgoing: UrlUnwrapper = (url) => {
  if (!isHostOf(url, mozillaOutgoingHosts)) {
    return
  }

  const match = url.pathname.match(pathRegex)
  if (!match) {
    return
  }

  return decodeSegment(match[1])
}
