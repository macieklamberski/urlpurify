import { isHttpUrl } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const pathRegex = /^\/dynclick\/[^/]+\/$/i

// Eulerian click redirect on any host
// (<advertiser host>/dynclick/<site>/?ept-publisher=<name>&eurl=<target>).
// Opt-in: unwrapping removes the click attribution. Advertisers run it on their own subdomains.
export const unwrapEulerian = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    const target = readParamTarget(url, 'eurl')

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  },
})
