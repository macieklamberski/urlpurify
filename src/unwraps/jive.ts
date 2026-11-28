import { isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

// Jive community external link redirect (<community host>/external-link.jspa?url=<target>). Each
// community runs on its own host, so the exact path and an http `url` are the guard, not the host.
export const unwrapJive: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/external-link.jspa')) {
      return
    }

    const target = readParamTarget(url, 'url')

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  },
})
