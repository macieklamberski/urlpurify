import { createPathUnwrapper } from '../pathTarget.js'

const prefixRegex = /^\/s\//i

// up.audio download measurement prefix (prefix.up.audio/s/<target>), where the target drops its
// scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapUpAudio = createPathUnwrapper({
  hosts: 'prefix.up.audio',
  prefix: prefixRegex,
})
