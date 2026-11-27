import { decodePercent } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { appendLinkFragment, createUnwrapper } from '../utils.js'

const pathRegex = /^\/v1\/[0-9a-f]{64}\/(.+)$/i

const hosts = [
  'outgoing.mozilla.org',
  'outgoing.prod.mozaws.net',
  'prod.outgoing.prod.webservices.mozgcp.net',
]

// Mozilla outgoing-link redirector used on Mozilla mailing lists, blogs, and
// support forums. Path: /v1/<sha256>/<URL-encoded-target>
export const unwrapMozillaOutgoing: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const match = url.pathname.match(pathRegex)
    if (!match) {
      return
    }

    return appendLinkFragment(decodePercent(match[1]), url)
  },
})
