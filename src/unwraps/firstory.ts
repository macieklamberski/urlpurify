import { isHostOf } from 'trousse'
import { readPathTarget } from '../pathTarget.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const trackPrefixRegex = /^\/track\/[^/]+\/[^/]+\//i
const playPathRegex = /^\/play\.[a-z0-9]+$/i
const shortPrefixRegex = /^\/p\/[^/]+\//i

const trackHosts = ['m.cdn.firstory.me', 'v1.firstory.me']
const playHosts = [...trackHosts, 'backend.endpoints.firstory-709db.cloud.goog']

// Firstory download measurement prefix (m.cdn.firstory.me/track/<show>/<episode>/<target>, with the
// target percent-encoded, and m.cdn.firstory.me/play.<ext>?url=<target>), also on v1.firstory.me,
// play.<ext>?url=<target> on backend.endpoints.firstory-709db.cloud.goog, and
// track.fstry.me/p/<id>/<target>, where the target often drops its scheme.
// Opt-in: unwrapping removes the publisher's download counts.
export const unwrapFirstory = createUnwrapper({
  hosts: [...playHosts, 'track.fstry.me'],
  unwrap: (url) => {
    if (isHostOf(url, 'track.fstry.me')) {
      return readPathTarget(url, shortPrefixRegex)
    }

    if (playPathRegex.test(url.pathname)) {
      return readParamTarget(url, 'url')
    }

    if (!isHostOf(url, trackHosts)) {
      return
    }

    return readPathTarget(url, trackPrefixRegex)
  },
})
