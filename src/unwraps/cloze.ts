import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// A link to a named contact puts `n/<base64url name>/` between the token and the target.
const pathRegex = /^\/r\/[\w-]+\/(?:n\/[\w-]+\/)?(.+)$/

// Cloze email click tracker (circulate.it/r/<token>/<target>, also
// circulate.it/r/<token>/n/<name>/<target>), with the target's scheme dropped.
// Not included in defaultUnwrappers: unwrapping removes the sender's click stats.
export const unwrapCloze: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'circulate.it')) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // Cloze keeps the scheme server-side, and an https site redirects from http.
  const target = `http://${match[1]}${url.search}${url.hash}`

  if (isHttpUrl(target)) {
    return target
  }
}
