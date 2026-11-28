import { createPathUnwrapper } from '../pathTarget.js'

const showPrefixRegex = /^\/\d+\//

// Podder download measurement prefix (p.podderapp.com/<show id>/<target>), where the target
// often drops its scheme.
// Opt-in: unwrapping removes the publisher's download counts.
export const unwrapPodder = createPathUnwrapper({
  hosts: 'p.podderapp.com',
  prefix: showPrefixRegex,
})
