import { isAnyOf, isHttpUrl, parseUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['friendfeed.com', 'www.friendfeed.com']

// FriendFeed share links (friendfeed.com/share?url=<page>, /share?link=, the bookmarklet frame at
// /share/bookmarklet/frame#url=, and the root form /?url=). The `title=` beside them is free text.
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapFriendFeed: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (isAnyOf(url.pathname, '/share')) {
      return readParamTarget(url, 'url') ?? readParamTarget(url, 'link')
    }

    // The bookmarklet frame's script reads its fragment, which the server never sees.
    if (isAnyOf(url.pathname, '/share/bookmarklet/frame')) {
      const fragment = parseUrl(`?${url.hash.slice(1)}`, url)

      return fragment && readParamTarget(fragment, 'url')
    }

    // The root path serves every other page too, so only an http target counts.
    if (url.pathname !== '/') {
      return
    }

    const target = readParamTarget(url, 'url')

    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
