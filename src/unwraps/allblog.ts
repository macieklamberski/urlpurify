import { createPathUnwrapper } from '../pathTarget.js'

// The segment before the target is the post's id, and the target keeps its scheme.
const linkPrefixRegex = /^\/\d+\/(?=https?:\/)/i

// Allblog metablog outbound link (link.allblog.net/<post id>/<target>), a toolbar page that framed
// the target.
export const unwrapAllblog = createPathUnwrapper({
  hosts: 'link.allblog.net',
  prefix: linkPrefixRegex,
})
