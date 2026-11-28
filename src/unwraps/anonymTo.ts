import { readPathTarget } from '../pathTarget.js'
import { createUnwrapper, decodeEncodedScheme } from '../utils.js'

// anonym.to shows its home page for a path target written `http:/` with one slash.
const pathTargetRegex = /^\/(?=https?:\/\/)/

// anonym.to referrer anonymizer (anonym.to/?<target> and anonym.to/<target>). The query target
// is the whole query string, written unencoded, so a raw one is taken verbatim.
export const unwrapAnonymTo = createUnwrapper({
  hosts: ['anonym.to', 'www.anonym.to'],
  unwrap: (url) => {
    if (url.pathname !== '/') {
      return readPathTarget(url, pathTargetRegex)
    }

    const target = url.search.slice(1)

    if (!target) {
      return
    }

    return decodeEncodedScheme(target)
  },
})
