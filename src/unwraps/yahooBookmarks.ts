import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const unwrapBookmarklet = createParamExtractor({
  hosts: ['bookmarks.yahoo.com', 'myweb2.search.yahoo.com', 'myweb.yahoo.com'],
  path: '/myresults/bookmarklet',
  params: ['u'],
})
const unwrapToolbar = createParamExtractor({
  hosts: 'bookmarks.yahoo.com',
  path: '/toolbar/savebm',
  params: ['u'],
})
const unwrapBuzz = createParamExtractor({
  hosts: ['buzz.yahoo.com', 'uk.buzz.yahoo.com'],
  path: '/buzz',
  params: ['targetUrl'],
})

// Yahoo Bookmarks, MyWeb and Buzz share buttons
// (bookmarks.yahoo.com/myresults/bookmarklet?u=<target>, also on myweb2.search.yahoo.com and
// myweb.yahoo.com, bookmarks.yahoo.com/toolbar/savebm?u= and buzz.yahoo.com/buzz?targetUrl=, also
// on uk.buzz.yahoo.com), never the t=, d= or headline= text. Opt-in: unwrapping returns the shared
// page, not the form that saves or votes for it.
export const unwrapYahooBookmarks: UrlUnwrapper = (url) => {
  return unwrapBookmarklet(url) ?? unwrapToolbar(url) ?? unwrapBuzz(url)
}
