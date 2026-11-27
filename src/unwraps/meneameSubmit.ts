import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const pathRegex = /^\/submit(?:\.php)?\/?$/i

const hosts = ['meneame.net', 'www.meneame.net']

// Menéame submit form (meneame.net/submit.php?url=<target>, also /submit, which /submit.php
// redirects to, each with or without a trailing slash, on meneame.net and www.meneame.net).
// Opt-in: unwrapping returns the shared page, not the submit form.
export const unwrapMeneameSubmit: UrlUnwrapper = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, pathRegex)) {
      return
    }

    // The `title=` beside it is the story's free-text title.
    return readParamTarget(url, 'url')
  },
})
