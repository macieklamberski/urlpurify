import { decodePercent } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const postmarkPathRegex = /^\/[23][mt]?(?<secure>s?)\/(?<target>[^/]+)\//i

// Postmark click tracker ({click,track}.pstmrk.it/{2,3}[m,t][s]/<encoded>/...). The segment
// after the version prefix carries the URL-encoded target without its scheme. An `s` in the
// prefix marks an https target, and any other prefix an http one.
export const unwrapPostmark: UrlUnwrapper = createUnwrapper({
  hosts: ['click.pstmrk.it', 'track.pstmrk.it'],
  unwrap: (url) => {
    const match = url.pathname.match(postmarkPathRegex)

    if (!match?.groups) {
      return
    }

    return `${match.groups.secure ? 'https' : 'http'}://${decodePercent(match.groups.target)}`
  },
})
