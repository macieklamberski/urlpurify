import { isAnyOf, parseUrl } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['friendfeed.com', 'www.friendfeed.com']

// FriendFeed share links (friendfeed.com/share?url=<page>, /share?link=, the bookmarklet frame at
// /share/bookmarklet/frame#url=, and the root form /?url=). The `title=` beside them is free text.
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapFriendFeed = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (isAnyOf(url.pathname, '/share')) {
      return readParamTarget(url, 'url') ?? readParamTarget(url, 'link')
    }

    // The bookmarklet frame's script reads its fragment, which the server never sees.
    if (isAnyOf(url.pathname, '/share/bookmarklet/frame')) {
      const fragment = parseUrl(`?${url.hash.slice(1)}`, url)

      return fragment && readParamTarget(fragment, 'url')
    }

    if (url.pathname !== '/') {
      return
    }

    return readParamTarget(url, 'url')
  },
})
