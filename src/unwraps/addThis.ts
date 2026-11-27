import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const bookmarkHosts = ['www.addthis.com']
const apiHosts = ['api.addthis.com']

const offerPathRegex = /^\/oexchange\/0\.8\/(?:forward\/[^/]+\/)?offer$/i

const isCarrierPath = (url: URL): boolean => {
  if (isHostOf(url, bookmarkHosts)) {
    return isAnyOf(url.pathname, '/bookmark.php')
  }

  return offerPathRegex.test(url.pathname)
}

// AddThis share links (www.addthis.com/bookmark.php?url=<page>, api.addthis.com/oexchange/0.8/
// offer?url= and /forward/<service>/offer?url=). Opt-in: unwrapping returns the shared page, not
// the form that shares it.
export const unwrapAddThis: UrlUnwrapper = createUnwrapper({
  hosts: [...bookmarkHosts, ...apiHosts],
  unwrap: (url) => {
    if (!isCarrierPath(url)) {
      return
    }

    // The `title=` and `description=` beside it are free text, even when they hold only a url.
    return readParamTarget(url, 'url')
  },
})
