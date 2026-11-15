import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const hosts = ['www.tumblr.com', 'tumblr.com']
const sharePathRegex = /^\/share\/?$/i
const linkPathRegex = /^\/share\/link\/?$/i
const toolPathRegex = /^\/widgets\/share\/tool\/?$/i

// Tumblr share (tumblr.com/share?u=<target> or ?canonicalUrl=, /share/link?url=, and
// /widgets/share/tool?canonicalUrl=, or ?url= when canonicalUrl is empty, on www. and bare
// tumblr.com). Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapTumblrShare: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts)) {
    return
  }

  if (sharePathRegex.test(url.pathname)) {
    return getParamTarget(url, 'u') ?? getParamTarget(url, 'canonicalUrl')
  }

  if (linkPathRegex.test(url.pathname)) {
    return getParamTarget(url, 'url')
  }

  if (toolPathRegex.test(url.pathname)) {
    return getParamTarget(url, 'canonicalUrl') ?? getParamTarget(url, 'url')
  }
}
