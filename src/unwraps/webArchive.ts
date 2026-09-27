import { decodeSegment, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/web\/\d{14}\*?\/(.+)$/

// Web Archive snapshot wrapper (web.archive.org/web/<timestamp>/<URL>).
// Not included in defaultUrlUnwrappers: an archive URL is a historical
// snapshot at a specific point in time, not a redirect; unwrapping returns
// the live page, which may have changed or 404'd. Opt in by passing a custom
// urlUnwrappers array.
export const unwrapWebArchive: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'web.archive.org')) {
    return
  }

  const match = url.pathname.match(pathRegex)
  if (!match) {
    return
  }

  return decodeSegment(match[1])
}
