import { createPathUnwrapper } from '../pathTarget.js'

const episodePrefixRegex = /^\/e\//i

// Podcorn, now Audacy Creator Lab, download measurement prefix (pdcn.co/e/<target>), where the
// target often drops its scheme.
// Opt-in: unwrapping removes the publisher's download counts.
export const unwrapPodcorn = createPathUnwrapper({
  hosts: ['pdcn.co', 'www.pdcn.co'],
  prefix: episodePrefixRegex,
})
