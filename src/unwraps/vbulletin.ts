import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

// A forum root prefix, such as /forum/ or /boards/.
const pathRegex = /^(?:\/[^/]+)?\/redirect-to\/$/i

// vBulletin SEO add-on external link redirect, vBSEO and DragonByte SEO
// (<forum host>/redirect-to/?redirect=<target>). Each forum runs on its own host, so the exact
// path and an http `redirect` are the guard, not the host.
export const unwrapVbulletin: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    const target = readParamTarget(url, 'redirect')

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  },
})
