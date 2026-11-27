import { createPathUnwrapper } from '../pathTarget.js'

const showPrefixRegex = /^\/\d+\//

// Podder download measurement prefix (p.podderapp.com/<show id>/<target>), where the target
// often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodder = createPathUnwrapper({
  hosts: 'p.podderapp.com',
  prefix: showPrefixRegex,
})
