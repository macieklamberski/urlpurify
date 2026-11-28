import { isAnyOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const paths = ['/blog_this.pyra', '/blog-this.g']

// Blogger BlogThis form (blogger.com/blog_this.pyra?u=<target> and /blog-this.g?u=, on www., bare,
// www2. and draft.blogger.com).
// Opt-in: unwrapping returns the shared page, not the post form.
export const unwrapBloggerBlogThis = createUnwrapper({
  hosts: ['blogger.com', 'www.blogger.com', 'www2.blogger.com', 'draft.blogger.com'],
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, paths)) {
      return
    }

    // The `t=` beside it is the quoted text and `n=` the title, free text even when it holds a url.
    return readParamTarget(url, 'u')
  },
})
