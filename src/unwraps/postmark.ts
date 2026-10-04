import { decodeSegment, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const postmarkPathRegex = /^\/[23][st]\/([^/]+)\//

// Postmark click tracker (click.pstmrk.it/{2,3}{s,t}/<encoded>/...). The segment after the version prefix carries the URL-encoded target.
export const unwrapPostmark: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'click.pstmrk.it')) {
    return
  }

  const match = url.pathname.match(postmarkPathRegex)
  if (!match) {
    return
  }

  return decodeSegment(match[1])
}
