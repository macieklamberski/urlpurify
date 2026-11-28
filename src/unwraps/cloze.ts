import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

// Some links put `n/<base64url link text>/` between the token and the target.
const pathRegex = /^\/r\/[\w-]+\/(?:n\/[\w-]+\/)?(?<target>.+)$/i

// Cloze email click tracker (circulate.it/r/<token>/<target>, also
// circulate.it/r/<token>/n/<link text>/<target>), with the target's scheme dropped.
// Opt-in: unwrapping removes the sender's click stats.
export const unwrapCloze = createUnwrapper({
  hosts: ['circulate.it', 'www.circulate.it'],
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    // Cloze keeps the scheme server-side, and an https site redirects from http.
    return resolvePathTarget(url, match.groups.target, 'http')
  },
})
