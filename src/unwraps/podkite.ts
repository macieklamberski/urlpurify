import { isAnyOf } from 'trousse'
import { readPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const schemePrefixRegex = /^\/(https?)\/[^/]+\//i

// Podkite download measurement prefix (growx.podkite.com/<scheme>/<show id>/<target>), where the
// target drops its scheme and the first segment names it.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodkite: UrlUnwrapper = createUnwrapper({
  hosts: 'growx.podkite.com',
  unwrap: (url) => {
    const match = url.pathname.match(schemePrefixRegex)

    if (!match) {
      return
    }

    return readPathTarget(url, schemePrefixRegex, isAnyOf(match[1], 'http') ? 'http' : 'https')
  },
})
