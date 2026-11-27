import { createPathUnwrapper } from '../pathTarget.js'

const episodePrefixRegex = /^\/[A-Za-z0-9]{12}\//

// Ausha download measurement prefix (tr.ausha.co/<episode id>/<target>), where the target drops
// its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapAusha = createPathUnwrapper({
  hosts: 'tr.ausha.co',
  prefix: episodePrefixRegex,
})
