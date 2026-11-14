import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const pathRegex = /^\/(?:intent\/(?:tweet|post)|share)\/?$/i

const hosts = ['twitter.com', 'www.twitter.com', 'mobile.twitter.com', 'x.com', 'www.x.com']

// Twitter / X share intent (twitter.com/intent/tweet?url=<target>, also /intent/post and /share,
// on twitter.com and x.com). Opt-in: unwrapping returns the shared page, not the post composer.
export const unwrapTwitterIntent: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, pathRegex)) {
    return
  }

  // The `text=` beside it is the post's message, even when it holds only a url.
  return getParamTarget(url, 'url')
}
