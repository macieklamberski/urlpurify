import { isAnyOf } from 'trousse'
import { readPathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const schemePrefixRegex = /^\/(?<scheme>https?)\/[^/]+\//i

// Podkite download measurement prefix (growx.podkite.com/<scheme>/<show id>/<target>), where the
// target drops its scheme and the first segment names it.
// Opt-in: unwrapping removes the podcaster's download counts.
export const unwrapPodkite = createUnwrapper({
  hosts: 'growx.podkite.com',
  unwrap: (url) => {
    const match = schemePrefixRegex.exec(url.pathname)

    if (!match?.groups) {
      return
    }

    return readPathTarget(
      url,
      schemePrefixRegex,
      isAnyOf(match.groups.scheme, 'http') ? 'http' : 'https',
    )
  },
})
