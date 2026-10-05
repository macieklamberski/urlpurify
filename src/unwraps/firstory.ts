import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const trackPrefixRegex = /^\/track\/[^/]+\/[^/]+\//
const playPathRegex = /^\/play\.[a-z0-9]+$/i

// Firstory download measurement prefix (m.cdn.firstory.me/track/<show>/<episode>/<target>, with the
// target percent-encoded, and m.cdn.firstory.me/play.<ext>?url=<target>).
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapFirstory: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'm.cdn.firstory.me')) {
    return
  }

  if (playPathRegex.test(url.pathname)) {
    return url.searchParams.get('url') || undefined
  }

  const match = url.pathname.match(trackPrefixRegex)

  if (!match) {
    return
  }

  try {
    return `${decodeURIComponent(url.pathname.slice(match[0].length))}${url.search}${url.hash}`
  } catch {}
}
