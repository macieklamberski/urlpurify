import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const prefixRegex = /^\/pdcst\/[A-Za-z0-9]+\//i

// Cohost download measurement prefix (cohst.app/pdcst/<id>/<target>), where the target drops its
// scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapCohst: UrlUnwrapper = createUnwrapper({
  hosts: 'cohst.app',
  unwrap: (url) => {
    return getPathTarget(url, prefixRegex)
  },
})
