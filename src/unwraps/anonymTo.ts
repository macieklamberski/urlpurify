import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// anonym.to referrer anonymizer (anonym.to/?<target>). The target is the whole query string
// rather than a named parameter, and it is not encoded, so it is taken verbatim.
export const unwrapAnonymTo: UrlUnwrapper = (url) => {
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
