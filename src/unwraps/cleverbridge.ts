import { hasQueryParam, isHttpUrl } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const pathRegex = /^\/\d+\/cookie$/i

// Cleverbridge affiliate cookie redirect on any host
// (<store host>/<client id>/cookie?affiliate=<id>&redirectto=<target>).
// Opt-in: unwrapping drops the publisher's commission. Merchants run it on their own store hosts.
export const unwrapCleverbridge = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname) || !hasQueryParam(url, 'affiliate')) {
      return
    }

    const target = readParamTarget(url, 'redirectto')

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  },
})
