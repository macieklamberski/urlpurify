import { createPathUnwrapper } from '../pathTarget.js'

const streamPrefixRegex = /^\/stream\/[^/]+\//i

// Voxnest download measurement prefix (audio.voxnest.com/stream/<show id>/<target>), where the
// target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapVoxnest = createPathUnwrapper({
  hosts: 'audio.voxnest.com',
  prefix: streamPrefixRegex,
  scheme: 'http', // The redirect names http for a target with no scheme, probed 2026-11-28
})
