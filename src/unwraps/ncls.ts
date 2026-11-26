import { isAnyOf, isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getParamTarget } from '../utils.js'

// ncls1.com affiliate click (ncls1.com/irk?enk=<encoded ids>&subid=<site>&d=<target>). Not included
// in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapNcls: UrlUnwrapper = createUnwrapper('ncls1.com', isHostOf, (url) => {
  if (!isAnyOf(url.pathname, '/irk')) {
    return
  }

  // A click nested unencoded in `d` spills its own `d` into this query, so the last one holds the
  // target.
  const target = getParamTarget(url, 'd', -1)

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
})
