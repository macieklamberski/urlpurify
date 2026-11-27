import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const episodePrefixRegex = /^\/[A-Za-z0-9]{12}\//

// Ausha download measurement prefix (tr.ausha.co/<episode id>/<target>), where the target drops
// its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapAusha: UrlUnwrapper = createUnwrapper({
  hosts: 'tr.ausha.co',
  unwrap: (url) => {
    return getPathTarget(url, episodePrefixRegex)
  },
})
