import { isAnyOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const pathRegex = /^\/bookmarklet\/popout\/?$/i

const hosts = ['share.flipboard.com', 'flipboard.com', 'www.flipboard.com']

// Flipboard share (share.flipboard.com/bookmarklet/popout?v=2&url=<target>&title=<title>, with or
// without a trailing slash, also on flipboard.com and www.flipboard.com).
// Opt-in: unwrapping returns the shared page, not the form that flips it into a magazine.
export const unwrapFlipboardShare = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, pathRegex)) {
      return
    }

    // The `title=` beside it is the story's free-text title, and `v=` is a version or a title.
    return readParamTarget(url, 'url')
  },
})
