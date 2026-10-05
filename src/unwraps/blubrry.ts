import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// The show slug, an optional one-letter segment, and then the target, which starts with a scheme
// or a host. A path with no host after the show is a file Blubrry hosts itself.
const showPrefixRegex =
  /^\/[^/]+\/(?:[bps]\/)?(?=\/*(?:https?:|[a-z0-9-]+(?:\.[a-z0-9-]+)+(?::\d+)?\/))/i
// Blubrry's own storage and ad insertion hosts, which serve the files it hosts.
const ownHostRegex = /^\/[^/]+\/(?:[bps]\/)?\/*(?:https?:\/*)?(?:content|ins|mc)\.blubrry\.com\//i

// Blubrry download measurement prefix in front of a file hosted elsewhere
// (media.blubrry.com/<show>/<target>, also with p/, s/ or b/ after the show), where the target
// often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapBlubrry: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'media.blubrry.com') || ownHostRegex.test(url.pathname)) {
    return
  }

  return getPathTarget(url, showPrefixRegex)
}
