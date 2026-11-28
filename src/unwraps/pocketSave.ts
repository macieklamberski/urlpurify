import { isAnyOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const paths = ['/save', '/edit', '/edit.php']

// Pocket save links (getpocket.com/save?url=<page>, /edit?url= and /edit.php?url=).
// Opt-in: unwrapping returns the saved page, not the form that saves it.
export const unwrapPocketSave = createUnwrapper({
  hosts: ['getpocket.com', 'www.getpocket.com'],
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, paths)) {
      return
    }

    // The `title=` beside it is free text, even when it holds only a url.
    return readParamTarget(url, 'url')
  },
})
