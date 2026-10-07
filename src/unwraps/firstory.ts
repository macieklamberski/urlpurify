import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

const trackPrefixRegex = /^\/track\/[^/]+\/[^/]+\//
const playPathRegex = /^\/play\.[a-z0-9]+$/i
const shortPrefixRegex = /^\/p\/[^/]+\//
const trackHosts = ['m.cdn.firstory.me', 'v1.firstory.me']
const playHosts = [...trackHosts, 'backend.endpoints.firstory-709db.cloud.goog']

// Firstory download measurement prefix (m.cdn.firstory.me/track/<show>/<episode>/<target>, with the
// target percent-encoded, and m.cdn.firstory.me/play.<ext>?url=<target>), also on v1.firstory.me,
// play.<ext>?url=<target> on backend.endpoints.firstory-709db.cloud.goog, and
// track.fstry.me/p/<id>/<target>, where the target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapFirstory: UrlUnwrapper = (url) => {
  if (isHostOf(url, 'track.fstry.me')) {
    return getPathTarget(url, shortPrefixRegex)
  }

  if (isHostOf(url, playHosts) && playPathRegex.test(url.pathname)) {
    return url.searchParams.get('url') || undefined
  }

  if (!isHostOf(url, trackHosts)) {
    return
  }

  const match = url.pathname.match(trackPrefixRegex)

  if (!match) {
    return
  }

  try {
    return `${decodeURIComponent(url.pathname.slice(match[0].length))}${url.search}${url.hash}`
  } catch {}
}
