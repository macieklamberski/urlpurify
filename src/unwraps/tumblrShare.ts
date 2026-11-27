import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['www.tumblr.com', 'tumblr.com']
const linkPathRegex = /^\/share\/link\/?$/i

// Tumblr share (tumblr.com/share?u=<target> or ?canonicalUrl=, /share/link?url=, and
// /widgets/share/tool?canonicalUrl=, or ?url= when canonicalUrl is empty, on www. and bare
// tumblr.com). Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapTumblrShare: UrlUnwrapper = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (isAnyOf(url.pathname, '/share')) {
      return readParamTarget(url, 'u') ?? readParamTarget(url, 'canonicalUrl')
    }

    if (linkPathRegex.test(url.pathname)) {
      return readParamTarget(url, 'url')
    }

    if (isAnyOf(url.pathname, '/widgets/share/tool')) {
      return readParamTarget(url, 'canonicalUrl') ?? readParamTarget(url, 'url')
    }
  },
})
