import { hasQueryParam, isAnyOf, isHttpUrl } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

// Fortinet FortiMail URL click protection on any host
// (<gateway host>/fmlurlsvc/?fewReq=<token>&url=<target>).
// Opt-in: unwrapping skips the gateway's click-time check of the target. Customers run it on their
// own hosts.
export const unwrapFortimail = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/fmlurlsvc/') || !hasQueryParam(url, 'fewReq')) {
      return
    }

    const target = readParamTarget(url, 'url')

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  },
})
