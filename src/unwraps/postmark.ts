import { decodeSegment, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const postmarkPathRegex = /^\/[23][mt]?(s?)\/([^/]+)\//

// Postmark click tracker ({click,track}.pstmrk.it/{2,3}[m,t][s]/<encoded>/...). The segment
// after the version prefix carries the URL-encoded target without its scheme. An `s` in the
// prefix marks an https target, and any other prefix an http one.
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
