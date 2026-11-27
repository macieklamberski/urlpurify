import { decodePercent, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper, createUnwrapper, decodeEncodedScheme } from '../utils.js'

// The first number is the show, as in the show's feeds.godcaster.fm/player_<n>.xml.
const episodePrefixRegex = /^\/act\/e\/\d+\/\d+\/\d+\//i
const supportPathRegex = /^\/act\/(?:sr\/\d+|fr\/\d+\/\d+)$/i

const extractSupportTarget = createQueryUnwrapper({
  hosts: 'go.godcaster.fm',
  params: ['d'],
})

// Godcaster download measurement prefix (go.godcaster.fm/act/e/<show>/<n>/<n>/<target>), where the
// target is percent-encoded twice, and its show-notes click counter
// (go.godcaster.fm/act/sr/<show>?d=<target>, also /act/fr/<show>/<n>?d=<target>).
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapGodcaster: UrlUnwrapper = createUnwrapper({
  hosts: 'go.godcaster.fm',
  unwrap: (url) => {
    if (supportPathRegex.test(url.pathname)) {
      return extractSupportTarget(url)
    }

    const match = url.pathname.match(episodePrefixRegex)

    if (!match) {
      return
    }

    const path = url.pathname.slice(match[0].length)
    const target = isHttpUrl(path) ? path : decodeEncodedScheme(decodePercent(path))

    return target
  },
})
