import { createPathUnwrapper } from '../pathTarget.js'

const prefixRegex = /^\/pdcst\/[A-Za-z0-9]+\//i

// Cohost download measurement prefix (cohst.app/pdcst/<id>/<target>), where the target drops its
// scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapCohst = createPathUnwrapper({
  hosts: 'cohst.app',
  prefix: prefixRegex,
})
