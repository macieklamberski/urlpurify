import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

// A forum root prefix, such as /forum/ or /ru/forum/.
const pathRegex = /^(?:\/[^/]+){0,2}\/away\.php$/i

// LogicBoard forum external link page (<forum host>/away.php?s=<target>). Each forum runs on its
// own host, so the exact path and an http `s` are the guard, not the host.
export const unwrapLogicboard: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    const target = readParamTarget(url, 's')

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  },
})
