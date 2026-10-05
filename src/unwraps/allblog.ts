import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// The segment before the target is the post's id, and the target keeps its scheme.
const linkPrefixRegex = /^\/\d+\/(?=https?:\/)/

// Allblog metablog outbound link (link.allblog.net/<post id>/<target>), a toolbar page that framed
// the target. The service is closed, and captures up to 2009 show the page loading the target.
export const unwrapAllblog: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'link.allblog.net')) {
    return
  }

  return getPathTarget(url, linkPrefixRegex)
}
