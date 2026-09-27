import { decodeSegment, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const postmarkPathRegex = /^\/[23][st]\/([^/]+)\//

// Postmark click-tracking redirect (click.pstmrk.it/<version><kind>/<encoded>/...).
// The version prefix is `2s`, `2t`, `3s`, or `3t`; the next segment carries
// the URL-encoded target.
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
