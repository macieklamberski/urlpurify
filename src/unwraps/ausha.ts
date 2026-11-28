import { createPathUnwrapper } from '../pathTarget.js'

const episodePrefixRegex = /^\/[A-Za-z0-9]{12}\//

// Ausha download measurement prefix (tr.ausha.co/<episode id>/<target>), where the target drops
// its scheme.
// Opt-in: unwrapping removes the publisher's download counts.
export const unwrapAusha = createPathUnwrapper({
  hosts: 'tr.ausha.co',
  prefix: episodePrefixRegex,
})
