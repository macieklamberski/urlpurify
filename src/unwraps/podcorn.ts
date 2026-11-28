import { createPathUnwrapper } from '../pathTarget.js'

const episodePrefixRegex = /^\/e\//i

// Podcorn, now Audacy Creator Lab, download measurement prefix (pdcn.co/e/<target>), where the
// target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodcorn = createPathUnwrapper({
  hosts: ['pdcn.co', 'www.pdcn.co'],
  prefix: episodePrefixRegex,
})
