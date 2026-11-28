import { isAnyOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['instapaper.com', 'www.instapaper.com']
const paths = ['/hello2', '/edit']

// Instapaper save links (instapaper.com/hello2?url=<target> and the signed-in form at /edit?url=).
// Opt-in: unwrapping returns the saved page, not the form that saves it.
export const unwrapInstapaperSave = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, paths)) {
      return
    }

    // The `title=` and `description=` beside it are free text, even when they hold only a url.
    return readParamTarget(url, 'url')
  },
})
