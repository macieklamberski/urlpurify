import { readPathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const streamPrefixRegex = /^\/stream\/[^/]+\//i

// Voxnest download measurement prefix (audio.voxnest.com/stream/<show id>/<target>), where the
// target often drops its scheme.
// Opt-in: unwrapping removes the publisher's download counts.
export const unwrapVoxnest = createUnwrapper({
  hosts: 'audio.voxnest.com',
  unwrap: (url) => {
    // Voxnest forwards to the path alone, dropping the query, and names http for a target with no
    // scheme, probed 2026-11-28.
    return readPathTarget(url, streamPrefixRegex, 'http', '')
  },
})
