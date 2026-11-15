import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const hosts = ['www.blogger.com', 'blogger.com', 'www2.blogger.com']
const paths = ['/blog_this.pyra', '/blog-this.g']

// Blogger BlogThis form (blogger.com/blog_this.pyra?u=<target> and /blog-this.g?u=, on www.,
// bare and www2.blogger.com). Opt-in: unwrapping returns the shared page, not the post form.
export const unwrapBloggerBlogThis: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, paths)) {
    return
  }

  // The `t=` beside it is the quoted text and `n=` the title, free text even when it holds a url.
  return getParamTarget(url, 'u')
}
