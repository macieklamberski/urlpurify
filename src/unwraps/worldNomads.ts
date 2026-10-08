import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const affiliatePaths = ['/Turnstile/AffiliateLink', '/af.aspx']

// World Nomads affiliate link (www.worldnomads.com/Turnstile/AffiliateLink?partnerCode=<id>&path=
// <target>, also /af.aspx?affiliate=<id>&path=<target>). Not included in defaultUnwrappers:
// unwrapping drops the publisher's commission.
export const unwrapWorldNomads: UrlUnwrapper = (url) => {
  if (url.hostname !== 'www.worldnomads.com' || !affiliatePaths.includes(url.pathname)) {
    return
  }

  // A Turnstile link nested unencoded in `path` spills its own `path` into this query, so the
  // last one holds the target.
  return getParamTarget(url, 'path', -1)
}
