import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Ad-inserted episodes carry `sponsor/<ids>/` before the target.
const playPrefixRegex = /^\/s\/[^/]+\/podcast\/play\/[^/]+\/(?:sponsor\/[^/]+\/)?/
const encodedSchemeRegex = /^https?%(?:25)?3A/i

// Spotify for Podcasters download prefix (anchor.fm/s/<show>/podcast/play/<episode>/<target>,
// also with sponsor/<ids>/ before the target), where the target is percent-encoded once or twice.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapAnchor: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'anchor.fm')) {
    return
  }

  const match = url.pathname.match(playPrefixRegex)

  if (!match) {
    return
  }

  let target = url.pathname.slice(match[0].length)

  try {
    while (encodedSchemeRegex.test(target)) {
      target = decodeURIComponent(target)
    }
  } catch {
    return
  }

  return `${target}${url.search}${url.hash}`
}
