import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

// A forum root prefix, such as /forum/ or /en/.
const pathRegex = /^(?:\/[^/]+)?\/redirect\/$/i

// No External Links plugin for Invision Community, its redirect or leaving page
// (<forum host>/redirect/?to=<target>). Each forum runs on its own host, so the exact path and an
// http `to` are the guard, not the host.
export const unwrapInvisionNoExternalLinks: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    const target = readParamTarget(url, 'to')

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  },
})
