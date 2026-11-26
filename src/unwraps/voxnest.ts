import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const streamPrefixRegex = /^\/stream\/[^/]+\//i

// Voxnest download measurement prefix (audio.voxnest.com/stream/<show id>/<target>), where the
// target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapVoxnest: UrlUnwrapper = createUnwrapper('audio.voxnest.com', isHostOf, (url) => {
  return getPathTarget(url, streamPrefixRegex, 'http:')
})
