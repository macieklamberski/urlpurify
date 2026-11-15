import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const hosts = ['getpocket.com']
const paths = ['/save', '/edit', '/edit.php']

// Pocket save links (getpocket.com/save?url=<page>, /edit?url= and /edit.php?url=). Opt-in:
// unwrapping returns the saved page, not the form that saves it.
export const unwrapPocketSave: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, paths)) {
    return
  }

  // The `title=` beside it is free text, even when it holds only a url.
  return getParamTarget(url, 'url')
}
