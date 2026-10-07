import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const schemePrefixRegex = /^\/(https?)\/[^/]+\//

// Podkite download measurement prefix (growx.podkite.com/<scheme>/<show id>/<target>), where the
// target drops its scheme and the first segment names it.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodkite: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'growx.podkite.com')) {
    return
  }

  const match = url.pathname.match(schemePrefixRegex)

  if (!match) {
    return
  }

  return getPathTarget(url, schemePrefixRegex, `${match[1]}:`)
}
