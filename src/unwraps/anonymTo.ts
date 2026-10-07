import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// anonym.to shows its home page for a path target written `http:/` with one slash.
const pathTargetRegex = /^\/(?=https?:\/\/)/

// anonym.to referrer anonymizer (anonym.to/?<target> and anonym.to/<target>). The query target
// is the whole query string, not encoded, so it is taken verbatim.
export const unwrapAnonymTo: UrlUnwrapper = (url) => {
  if (isHostOf(url, 'anonym.to') && url.pathname !== '/') {
    return getPathTarget(url, pathTargetRegex)
  }

  if (!isHostOf(url, ['anonym.to', 'www.anonym.to']) || url.pathname !== '/') {
    return
  }

  const target = url.search.slice(1)

  if (!target) {
    return
  }

  // The target's own fragment lands in the wrapper's `hash`.
  return `${target}${url.hash}`
}
