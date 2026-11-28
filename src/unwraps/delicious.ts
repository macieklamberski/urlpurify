import { isAnyOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const paths = ['/post', '/save']

// Delicious bookmark form (del.icio.us/post?url=<target>, delicious.com/post?url= and
// delicious.com/save?url=, on del.icio.us, delicious.com and www.delicious.com).
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapDelicious = createUnwrapper({
  hosts: ['del.icio.us', 'delicious.com', 'www.delicious.com'],
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, paths)) {
      return
    }

    // The `title=` and `notes=` beside it are free text, even when they hold only a url.
    return readParamTarget(url, 'url')
  },
})
