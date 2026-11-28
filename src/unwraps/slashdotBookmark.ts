import { isAnyOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['slashdot.org', 'www.slashdot.org']

const pathRegex = /^\/(?:bookmark|slashdot-it)\.pl$/i

// Slashdot share links (slashdot.org/bookmark.pl?url=<target>, and the badge at
// /slashdot-it.pl?url=, on slashdot.org and www.slashdot.org).
// Opt-in: unwrapping returns the shared page, not the form that bookmarks or submits it.
export const unwrapSlashdotBookmark = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, pathRegex)) {
      return
    }

    // The `title=` beside it is free text, even when it holds only a url.
    return readParamTarget(url, 'url')
  },
})
