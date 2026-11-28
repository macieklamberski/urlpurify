import { hasQueryParam, isAnyOf, isHttpUrl } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const params = ['url', 'u', 'nonencodedurl']

// LinkTrust affiliate click on networks' and merchants' own tracking hosts
// (<host>/click.track?CID=<campaign>&AFID=<affiliate>&url=<target>, also u and nonencodedurl).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapLinktrust = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    const isClick = isAnyOf(url.pathname, '/click.track')

    if (!isClick || !hasQueryParam(url, 'CID') || !hasQueryParam(url, 'AFID')) {
      return
    }

    // A tracking link nested unencoded in a carrier spills its own carrier into this query, so the
    // last value holds the target.
    for (const param of params) {
      const target = readParamTarget(url, param, { index: -1 })

      if (target && isHttpUrl(target)) {
        return target
      }
    }
  },
})
