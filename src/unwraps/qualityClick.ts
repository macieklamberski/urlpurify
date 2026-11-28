import { hasQueryParam, isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

// QUALITYCLICK partner software by NetSlave, run by each merchant on its own host
// (<host>/go.cgi?pid=<partner>&wmid=<id>&cpid=<id>&target=<target>). Other scripts also answer on
// `go.cgi`, so `pid`, `wmid` and an http `target` together are the guard, not the host. Opt-in:
// unwrapping drops the publisher's commission.
export const unwrapQualityClick: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/go.cgi')) {
      return
    }

    if (!hasQueryParam(url, 'pid') || !hasQueryParam(url, 'wmid')) {
      return
    }

    const target = readParamTarget(url, 'target')

    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
