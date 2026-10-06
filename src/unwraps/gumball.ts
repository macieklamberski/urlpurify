import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// On 2.gum.fm the target follows the host, so the first segment has to look like a host.
const hostPrefixRegex = /^\/(?=[a-z0-9-]+(?:\.[a-z0-9-]+)+\/)/i
const showPrefixRegex = /^\/s-[0-9a-f]{24}\//i

// Gumball download measurement prefix (2.gum.fm/<target> and s.gum.fm/s-<show id>/<target>),
// where the target drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapGumball: UrlUnwrapper = (url) => {
  if (isHostOf(url, '2.gum.fm')) {
    return getPathTarget(url, hostPrefixRegex)
  }

  if (isHostOf(url, 's.gum.fm')) {
    return getPathTarget(url, showPrefixRegex)
  }
}
