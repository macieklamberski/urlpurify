import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const submitPathRegex = /^\/submit\/?$/i

const extractBookmarklet = createQueryUnwrapper({
  hosts: ['bookmarks.yahoo.com', 'myweb2.search.yahoo.com', 'myweb.yahoo.com'],
  path: '/myresults/bookmarklet',
  params: ['u'],
  ignoreLinkFragment: true,
})
const extractToolbar = createQueryUnwrapper({
  hosts: 'bookmarks.yahoo.com',
  path: '/toolbar/savebm',
  params: ['u'],
  ignoreLinkFragment: true,
})
const extractBuzz = createQueryUnwrapper({
  hosts: ['buzz.yahoo.com', 'fr.buzz.yahoo.com', 'uk.buzz.yahoo.com'],
  path: '/buzz',
  params: ['targetUrl', 'guid'],
  ignoreLinkFragment: true,
})

// Some share links put the title in submitUrl= and the page in u=.
const extractBuzzSubmit = createQueryUnwrapper({
  hosts: 'buzz.yahoo.com',
  path: submitPathRegex,
  params: ['submitUrl', 'u'],
  ignoreLinkFragment: true,
})

// Yahoo Bookmarks, MyWeb and Buzz share buttons
// (bookmarks.yahoo.com/myresults/bookmarklet?u=<target>, also on myweb2.search.yahoo.com and
// myweb.yahoo.com, bookmarks.yahoo.com/toolbar/savebm?u=, buzz.yahoo.com/buzz?targetUrl= or guid=
// when targetUrl= is empty, also on fr. and uk.buzz.yahoo.com, and buzz.yahoo.com/submit?submitUrl=
// or u= when submitUrl= holds the title), never the t=, d=, headline= or submitHeadline= text.
// Opt-in: unwrapping returns the shared page, not the form that saves or votes for it.
export const unwrapYahooBookmarks = createUnwrapper({
  hosts: [
    'bookmarks.yahoo.com',
    'myweb2.search.yahoo.com',
    'myweb.yahoo.com',
    'buzz.yahoo.com',
    'fr.buzz.yahoo.com',
    'uk.buzz.yahoo.com',
  ],
  ignoreLinkFragment: true,
  unwrap: (url) => {
    return (
      extractBookmarklet(url) ?? extractToolbar(url) ?? extractBuzz(url) ?? extractBuzzSubmit(url)
    )
  },
})
