import { decodeSegment, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const postmarkPathRegex = /^\/[23](s?)\/([^/]+)\//

// Postmark click tracker ({click,track}.pstmrk.it/{2,3}[s]/<encoded>/...). The segment after
// the version prefix carries the URL-encoded target without its scheme. The `s` suffix marks an
// https target, and a bare version an http one.
export const unwrapPostmark: UrlUnwrapper = (url) => {
  if (!isHostOf(url, ['click.pstmrk.it', 'track.pstmrk.it'])) {
    return
  }

  const match = url.pathname.match(postmarkPathRegex)

  if (!match) {
    return
  }

  const target = decodeSegment(match[2])

  if (!target) {
    return
  }

  return `${match[1] ? 'https' : 'http'}://${target}`
}
