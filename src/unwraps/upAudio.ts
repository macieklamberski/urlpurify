import { createPathUnwrapper } from '../pathTarget.js'

const prefixRegex = /^\/s\//i

// up.audio download measurement prefix (prefix.up.audio/s/<target>), where the target drops its
// scheme.
// Opt-in: unwrapping removes the publisher's download counts.
export const unwrapUpAudio = createPathUnwrapper({
  hosts: 'prefix.up.audio',
  prefix: prefixRegex,
})
