import { decodePercent, hasQueryParam, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamValues } from '../utils.js'

const encodedSchemeRegex = /^https?%3A/i

// QUALITYCLICK partner software by NetSlave, run by each merchant on its own host
// (<host>/go.cgi?pid=<partner>&wmid=<id>&cpid=<id>&target=<target>). Other scripts also answer on
// `go.cgi`, so `pid`, `wmid` and an http `target` together are the guard, not the host. Opt-in:
// unwrapping drops the publisher's commission.
export const unwrapQualityClick: UrlUnwrapper = (url) => {
  if (url.pathname !== '/go.cgi') {
    return
  }

  if (!hasQueryParam(url, 'pid') || !hasQueryParam(url, 'wmid')) {
    return
  }

  let target = getParamValues(url, 'target').at(0)

  // A target encoded twice still holds an encoded scheme after one decode.
  if (target && encodedSchemeRegex.test(target)) {
    target = decodePercent(target)
  }

  if (target && isHttpUrl(target)) {
    return target
  }
}
