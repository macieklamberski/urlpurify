import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const prefixRegex = /^\/s\//i

// up.audio download measurement prefix (prefix.up.audio/s/<target>), where the target drops its
// scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapUpAudio: UrlUnwrapper = createUnwrapper({
  hosts: 'prefix.up.audio',
  unwrap: (url) => {
    return getPathTarget(url, prefixRegex)
  },
})
