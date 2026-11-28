import { isAnyOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const pathRegex = /^\/(?:intent\/(?:tweet|post)|share)\/?$/i

// Twitter / X share intent (twitter.com/intent/tweet?url=<target>, also /intent/post and /share, on
// twitter.com and x.com).
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapTwitterIntent = createUnwrapper({
  hosts: ['twitter.com', 'www.twitter.com', 'mobile.twitter.com', 'x.com', 'www.x.com'],
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, pathRegex)) {
      return
    }

    // The `text=` beside it is the post's message, even when it holds only a url.
    return readParamTarget(url, 'url')
  },
})
