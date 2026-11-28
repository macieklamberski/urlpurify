import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, decodeEncodedScheme } from '../utils.js'

// href.li referrer stripper (href.li/?<target>), which Tumblr wraps outbound links in, both
// on its own and nested inside a t.umblr.com redirect. The target is the whole query string
// rather than a named parameter, written unencoded, so a raw one is taken verbatim.
export const unwrapHrefLi: UrlUnwrapper = createUnwrapper({
  hosts: ['href.li', 'www.href.li'],
  unwrap: (url) => {
    if (url.pathname !== '/') {
      return
    }

    const target = url.search.slice(1)

    if (!target) {
      return
    }

    return decodeEncodedScheme(target)
  },
})
