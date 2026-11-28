import { createUnwrapper, readParamTarget } from '../utils.js'

const pathRegex = /^\/(?:index\/?|index\.html)?$/i

// diaspora* share form (share.diasporafoundation.org/?url=<page>, also /index, /index/ and
// /index.html).
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapDiasporaShare = createUnwrapper({
  hosts: 'share.diasporafoundation.org',
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    // The `title=` beside it is the post's text, even when it holds only a url.
    return readParamTarget(url, 'url')
  },
})
