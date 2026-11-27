import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const prefixRegex = /^\/(?:e\/p?\d+|track)\//i

// Magellan AI download measurement prefix (mgln.ai/e/<id>/<target> and mgln.ai/track/<target>),
// where the target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapMagellan: UrlUnwrapper = createUnwrapper({
  hosts: 'mgln.ai',
  unwrap: (url) => {
    return getPathTarget(url, prefixRegex)
  },
})
