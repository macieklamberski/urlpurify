import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const hosts = ['www.instapaper.com', 'instapaper.com']
const paths = ['/hello2', '/edit', '/api/add']

// Instapaper save links (instapaper.com/hello2?url=<target>, the signed-in form at /edit?url= and
// the simple API at /api/add?url=). Opt-in: unwrapping returns the saved page, not the form that
// saves it.
export const unwrapInstapaperSave: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, paths)) {
    return
  }

  // The `title=` and `description=` beside it are free text, even when they hold only a url.
  return getParamTarget(url, 'url')
}
