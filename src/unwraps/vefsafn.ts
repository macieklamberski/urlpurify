import { isHostOf } from 'trousse'
import { addArchivedScheme, resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

// Legacy replay on wayback.vefsafn.is: a 14-digit timestamp after the wayback prefix.
const waybackPathRegex = /^\/wayback\/\d{14}\/(?<target>.+)$/i

// Current replay on vefsafn.is: a 14-digit timestamp with an optional mp_ modifier after the
// language prefix.
const currentPathRegex = /^\/is\/\d{14}(?:mp_)?\/(?<target>.+)$/i

const currentHosts = ['vefsafn.is', 'www.vefsafn.is']

// Icelandic web archive snapshot, run by the National and University Library of Iceland
// (wayback.vefsafn.is/wayback/<timestamp>/<target> and vefsafn.is/is/<timestamp>[mp_]/<target>).
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapVefsafn = createUnwrapper({
  hosts: ['wayback.vefsafn.is', ...currentHosts],
  unwrap: (url) => {
    let match: RegExpExecArray | null = null

    if (isHostOf(url, 'wayback.vefsafn.is')) {
      match = waybackPathRegex.exec(url.pathname)
    }

    if (isHostOf(url, currentHosts)) {
      match = currentPathRegex.exec(url.pathname)
    }

    if (!match?.groups?.target) {
      return
    }

    return addArchivedScheme(resolvePathTarget(url, match.groups.target))
  },
})
