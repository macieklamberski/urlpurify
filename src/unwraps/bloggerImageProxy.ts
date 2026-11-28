import { isAnyOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

// Google gadget image proxy, as Blogger serves it, on three host shapes:
// - images-blogger-opensocial.googleusercontent.com/gadgets/proxy?url=<source>
// - images0-focus-opensocial.googleusercontent.com/gadgets/proxy?url=<source>
// - <any>.gmodules.com/gadgets/proxy?container=<name>&url=<source>
// Not included in defaultUnwrappers: unwrapping swaps the proxied copy for the original image.
export const unwrapBloggerImageProxy = createUnwrapper({
  domains: ['gmodules.com', 'googleusercontent.com'],
  // Every gmodules.com host proxies, but on googleusercontent.com only the two gadget hosts do.
  match:
    /(?:^|\.)gmodules\.com$|^images-blogger-opensocial\.googleusercontent\.com$|^(?:images)?\d-focus-opensocial\.googleusercontent\.com$/,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/gadgets/proxy')) {
      return
    }

    return readParamTarget(url, 'url', { index: -1, plus: 'keep' })
  },
})
