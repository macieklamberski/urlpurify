import { createPathUnwrapper } from '../pathTarget.js'

const showPrefixRegex = /^\/[0-9a-f]{24}\//

// Cast+ download measurement prefix (traffic.cast.plus/<show id>/<target>), where the target
// mostly drops its scheme. The service forwarded such a target to http, even from https.
// Opt-in: unwrapping removes the podcaster's download counts.
export const unwrapCastPlus = createPathUnwrapper({
  hosts: 'traffic.cast.plus',
  prefix: showPrefixRegex,
  scheme: 'http',
})
