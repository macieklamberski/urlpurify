import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const showPrefixRegex = /^\/d\/[^/]+\//
const redirectPrefixRegex = /^\/(?:pts\/)?redirect\.mp3\//

// 5by5 network download measurement prefixes (fdlyr.co/d/<show>/<target>, and
// /redirect.mp3/<target> on d.5by5.net and d.ahoy.co, also /pts/redirect.mp3/<target>).
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapFiveByFive: UrlUnwrapper = (url) => {
  // The targets drop their scheme. Archived captures show every host forwarding them to http.
  if (isHostOf(url, 'fdlyr.co')) {
    return getPathTarget(url, showPrefixRegex, 'http:')
  }

  if (!isHostOf(url, ['d.5by5.net', 'd.ahoy.co'])) {
    return
  }

  return getPathTarget(url, redirectPrefixRegex, 'http:')
}
