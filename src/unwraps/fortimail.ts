import { hasQueryParam, isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

// Fortinet FortiMail URL click protection on any host
// (<gateway host>/fmlurlsvc/?fewReq=<token>&url=<target>).
// Opt-in: an email security gateway, like Outlook Safe Links. Customers run it on their own hosts.
export const unwrapFortimail: UrlUnwrapper = createUnwrapper({
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
