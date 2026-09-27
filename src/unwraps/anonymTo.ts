import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// anonym.to referrer anonymizer (anonym.to/?<target>). The target is the whole query string
// rather than a named parameter, and it is not encoded, so it is taken verbatim.
export const unwrapAnonymTo: UrlUnwrapper = (url) => {
  if (!isHostOf(url, ['anonym.to', 'www.anonym.to'])) {
    return
  }

  return url.search.slice(1) || undefined
}
