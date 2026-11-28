import { isHostOf } from 'trousse'
import { readPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const showPrefixRegex = /^\/d\/[^/]+\//i
const redirectPrefixRegex = /^\/(?:pts\/)?redirect\.mp3\//i

const showHosts = ['fdlyr.co', 'www.fdlyr.co']

// 5by5 network download measurement prefixes (fdlyr.co/d/<show>/<target>, and
// /redirect.mp3/<target> on d.5by5.net and d.ahoy.co, also /pts/redirect.mp3/<target>).
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapFiveByFive: UrlUnwrapper = createUnwrapper({
  hosts: [...showHosts, 'd.5by5.net', 'd.ahoy.co'],
  unwrap: (url) => {
    // The targets drop their scheme. Archived captures show every host forwarding them to http.
    if (isHostOf(url, showHosts)) {
      return readPathTarget(url, showPrefixRegex, 'http:')
    }

    return readPathTarget(url, redirectPrefixRegex, 'http:')
  },
})
