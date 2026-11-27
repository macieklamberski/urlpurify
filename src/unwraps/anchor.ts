import { decodePercent, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, decodeEncodedScheme } from '../utils.js'

// Ad-inserted episodes carry `sponsor/<ids>/` before the target.
const playPrefixRegex = /^\/s\/[^/]+\/podcast\/play\/[^/]+\/(?:sponsor\/[^/]+\/)?/i

// Spotify for Podcasters download prefix (anchor.fm/s/<show>/podcast/play/<episode>/<target>,
// also with sponsor/<ids>/ before the target), where the target is percent-encoded once or twice.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapAnchor: UrlUnwrapper = createUnwrapper({
  hosts: 'anchor.fm',
  unwrap: (url) => {
    const match = url.pathname.match(playPrefixRegex)

    if (!match) {
      return
    }

    const path = url.pathname.slice(match[0].length)
    const target = isHttpUrl(path) ? path : decodeEncodedScheme(decodePercent(path))

    return target
  },
})
