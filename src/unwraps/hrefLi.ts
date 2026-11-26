import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// href.li referrer stripper (href.li/?<target>), which Tumblr wraps outbound links in, both
// on its own and nested inside a t.umblr.com redirect. The target is the whole query string
// rather than a named parameter, and it is not encoded, so it is taken verbatim.
export const unwrapHrefLi: UrlUnwrapper = createUnwrapper(
  ['href.li', 'www.href.li'],
  isHostOf,
  (url) => {
    if (url.pathname !== '/') {
      return
    }

    const target = url.search.slice(1)

    if (!target) {
      return
    }

    // The target's own fragment lands in the wrapper's `hash`.
    return `${target}${url.hash}`
  },
)
