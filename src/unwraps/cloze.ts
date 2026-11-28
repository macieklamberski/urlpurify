import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// Some links put `n/<base64url link text>/` between the token and the target.
const pathRegex = /^\/r\/[\w-]+\/(?:n\/[\w-]+\/)?(.+)$/i

// Cloze email click tracker (circulate.it/r/<token>/<target>, also
// circulate.it/r/<token>/n/<link text>/<target>), with the target's scheme dropped.
// Not included in defaultUnwrappers: unwrapping removes the sender's click stats.
export const unwrapCloze: UrlUnwrapper = createUnwrapper({
  hosts: 'circulate.it',
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.[1]) {
      return
    }

    // Cloze keeps the scheme server-side, and an https site redirects from http.
    return `http://${match[1]}${url.search}`
  },
})
