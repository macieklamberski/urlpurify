import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// The segment before the target is the post's id, and the target keeps its scheme.
const linkPrefixRegex = /^\/\d+\/(?=https?:\/)/i

// Allblog metablog outbound link (link.allblog.net/<post id>/<target>), a toolbar page that framed
// the target.
export const unwrapAllblog: UrlUnwrapper = createUnwrapper({
  hosts: 'link.allblog.net',
  unwrap: (url) => {
    return getPathTarget(url, linkPrefixRegex)
  },
})
