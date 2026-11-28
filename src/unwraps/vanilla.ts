import { isHttpUrl } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

// A locale or subcommunity prefix, such as /en/ or /en/madden-nfl/.
const pathRegex = /^(?:\/[^/]+){0,2}\/home\/leaving$/i

// Vanilla Forums leaving page (<forum host>/home/leaving?target=<target>). Each forum runs on its
// own host, so the exact path and an http `target` are the guard, not the host.
export const unwrapVanilla = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    // Older Vanilla versions spell the carrier `Target`, which the case-blind read covers.
    const target = readParamTarget(url, 'target')

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  },
})
