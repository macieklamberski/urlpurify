import { isHostOf } from 'trousse'
import { readPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const measureHosts = ['claritaspod.com', 'www.claritaspod.com']

const measurePrefixRegex = /^\/measure\//i
const shortPrefixRegex = /^\/m\//i

// Claritas download measurement prefix (claritaspod.com/measure/<target>, also on
// www.claritaspod.com, and clrtpod.com/m/<target>), where the target drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapClaritas: UrlUnwrapper = createUnwrapper({
  hosts: [...measureHosts, 'clrtpod.com', 'www.clrtpod.com'],
  unwrap: (url) => {
    if (isHostOf(url, measureHosts)) {
      return readPathTarget(url, measurePrefixRegex)
    }

    return readPathTarget(url, shortPrefixRegex)
  },
})
