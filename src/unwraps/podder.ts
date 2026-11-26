import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const showPrefixRegex = /^\/\d+\//

// Podder download measurement prefix (p.podderapp.com/<show id>/<target>), where the target
// often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodder: UrlUnwrapper = createUnwrapper('p.podderapp.com', isHostOf, (url) => {
  return getPathTarget(url, showPrefixRegex)
})
