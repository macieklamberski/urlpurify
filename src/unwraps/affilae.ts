import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getParamTarget } from '../utils.js'

// Affilae affiliate click (lb.affilae.com/r/?p=<program id>&af=<id>&lp=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapAffilae: UrlUnwrapper = createUnwrapper({
  hosts: 'lb.affilae.com',
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/r/')) {
      return
    }

    // An Affilae click nested unencoded in `lp` spills its own `lp` into this query, so the last
    // one holds the target.
    return getParamTarget(url, 'lp', -1)
  },
})
