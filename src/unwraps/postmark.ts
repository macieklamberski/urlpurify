import { decodePercent } from 'trousse'
import { createUnwrapper } from '../utils.js'

const postmarkPathRegex = /^\/[23][mt]?(?<secure>s?)\/(?<target>[^/]+)\//i

// Postmark click tracker ({click,track}.pstmrk.it/{2,3}[m,t][s]/<encoded>/...). The segment
// after the version prefix carries the URL-encoded target without its scheme. An `s` in the
// prefix marks an https target, and any other prefix an http one.
// Opt-in: unwrapping removes the sender's click count.
export const unwrapPostmark = createUnwrapper({
  hosts: ['click.pstmrk.it', 'track.pstmrk.it'],
  unwrap: (url) => {
    const match = postmarkPathRegex.exec(url.pathname)

    if (!match?.groups) {
      return
    }

    const target = `${match.groups.secure ? 'https' : 'http'}://${decodePercent(match.groups.target)}`

    return target
  },
})
