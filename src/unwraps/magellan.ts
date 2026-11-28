import { createPathUnwrapper } from '../pathTarget.js'

const prefixRegex = /^\/(?:e\/p?\d+|track)\//i

// Magellan AI download measurement prefix (mgln.ai/e/<id>/<target> and mgln.ai/track/<target>),
// where the target often drops its scheme.
// Opt-in: unwrapping removes the podcaster's download counts.
export const unwrapMagellan = createPathUnwrapper({
  hosts: ['mgln.ai', 'www.mgln.ai'],
  prefix: prefixRegex,
})
