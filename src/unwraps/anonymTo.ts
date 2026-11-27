import { isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// anonym.to shows its home page for a path target written `http:/` with one slash.
const pathTargetRegex = /^\/(?=https?:\/\/)/

// anonym.to referrer anonymizer (anonym.to/?<target> and anonym.to/<target>). The query target
// is the whole query string, not encoded, so it is taken verbatim.
export const unwrapAnonymTo: UrlUnwrapper = createUnwrapper({
  hosts: ['anonym.to', 'www.anonym.to'],
  unwrap: (url) => {
    if (isHostOf(url, 'anonym.to') && url.pathname !== '/') {
      return getPathTarget(url, pathTargetRegex)
    }

    if (url.pathname !== '/') {
      return
    }

    const target = url.search.slice(1)

    if (!target) {
      return
    }

    return target
  },
})
