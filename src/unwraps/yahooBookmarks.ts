import { isAnyOf, isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, readParamTarget } from '../utils.js'

const submitPathRegex = /^\/submit\/?$/i

const unwrapBookmarklet = createParamExtractor({
  hosts: ['bookmarks.yahoo.com', 'myweb2.search.yahoo.com', 'myweb.yahoo.com'],
  path: '/myresults/bookmarklet',
  params: ['u'],
  ignoreLinkFragment: true,
})
const unwrapToolbar = createParamExtractor({
  hosts: 'bookmarks.yahoo.com',
  path: '/toolbar/savebm',
  params: ['u'],
  ignoreLinkFragment: true,
})
const unwrapBuzz = createParamExtractor({
  hosts: ['buzz.yahoo.com', 'fr.buzz.yahoo.com', 'uk.buzz.yahoo.com'],
  path: '/buzz',
  params: ['targetUrl', 'guid'],
  ignoreLinkFragment: true,
})

const unwrapBuzzSubmit: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'buzz.yahoo.com') || !isAnyOf(url.pathname, submitPathRegex)) {
    return
  }

  const submitUrl = readParamTarget(url, 'submitUrl')

  if (submitUrl && isHttpUrl(submitUrl)) {
    return submitUrl
  }

  // Some share links put the title in submitUrl= and the page in u=.
  return readParamTarget(url, 'u')
}

// Yahoo Bookmarks, MyWeb and Buzz share buttons
// (bookmarks.yahoo.com/myresults/bookmarklet?u=<target>, also on myweb2.search.yahoo.com and
// myweb.yahoo.com, bookmarks.yahoo.com/toolbar/savebm?u=, buzz.yahoo.com/buzz?targetUrl= or guid=
// when targetUrl= is empty, also on fr. and uk.buzz.yahoo.com, and buzz.yahoo.com/submit?submitUrl=
// or u= when submitUrl= holds the title), never the t=, d=, headline= or submitHeadline= text.
// Opt-in: unwrapping returns the shared page, not the form that saves or votes for it.
export const unwrapYahooBookmarks: UrlUnwrapper = (url) => {
  return unwrapBookmarklet(url) ?? unwrapToolbar(url) ?? unwrapBuzz(url) ?? unwrapBuzzSubmit(url)
}
