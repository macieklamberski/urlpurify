import { createQueryUnwrapper } from '../utils.js'

// Google Bookmarks add and edit form (www.google.com/bookmarks/mark?op=edit&bkmk=<target>, also
// ?op=add).
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapGoogleBookmarks = createQueryUnwrapper({
  hosts: ['google.com', 'www.google.com'],
  path: '/bookmarks/mark',
  params: ['bkmk'],
  ignoreLinkFragment: true,
})
