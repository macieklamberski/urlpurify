import { createParamExtractor } from '../utils.js'

// Google Bookmarks add and edit form (www.google.com/bookmarks/mark?op=edit&bkmk=<target>, also
// ?op=add). Opt-in: unwrapping returns the bookmarked page, not the form that bookmarks it.
export const unwrapGoogleBookmarks = createParamExtractor({
  hosts: ['google.com', 'www.google.com'],
  path: '/bookmarks/mark',
  params: ['bkmk'],
  ignoreLinkFragment: true,
})
