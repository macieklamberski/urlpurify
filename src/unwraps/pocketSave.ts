import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const hosts = ['getpocket.com']
const paths = ['/save', '/edit', '/edit.php']
const widgetHosts = ['widgets.getpocket.com']
const widgetPaths = ['/v1/button']

// Pocket save links (getpocket.com/save?url=<page>, /edit?url= and /edit.php?url=) and the save
// button frame (widgets.getpocket.com/v1/button?url=). Opt-in: unwrapping returns the saved page,
// not the form that saves it.
export const unwrapPocketSave: UrlUnwrapper = (url) => {
  const isSave = isHostOf(url, hosts) && isAnyOf(url.pathname, paths)
  const isWidget = isHostOf(url, widgetHosts) && isAnyOf(url.pathname, widgetPaths)

  if (!isSave && !isWidget) {
    return
  }

  // The `title=` beside it is free text, even when it holds only a url.
  return getParamTarget(url, 'url')
}
