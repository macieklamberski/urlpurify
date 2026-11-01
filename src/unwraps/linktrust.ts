import { hasQueryParam, isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const params = ['url', 'u', 'nonencodedurl']

// LinkTrust affiliate click on networks' and merchants' own tracking hosts
// (<host>/click.track?CID=<campaign>&AFID=<affiliate>&url=<target>, also u and nonencodedurl).
// Opt-in: unwrapping drops the affiliate's commission.
export const unwrapLinktrust: UrlUnwrapper = (url) => {
  const isClick = isAnyOf(url.pathname, '/click.track')

  if (!isClick || !hasQueryParam(url, 'CID') || !hasQueryParam(url, 'AFID')) {
    return
  }

  // A tracking link nested unencoded in a carrier spills its own carrier into this query, so the
  // last value holds the target.
  for (const param of params) {
    const target = getParamTarget(url, param, -1)

    if (target && isHttpUrl(target)) {
      return target
    }
  }
}
