import { createPathUnwrapper } from '../pathTarget.js'

const prefixRegex = /^\/[A-Za-z0-9]+\//

// Vpixl download measurement prefix (pfx.vpixl.com/<id>/<target>), where the target drops its
// scheme.
// Opt-in: unwrapping removes the podcaster's download counts.
export const unwrapVpixl = createPathUnwrapper({
  hosts: 'pfx.vpixl.com',
  prefix: prefixRegex,
})
