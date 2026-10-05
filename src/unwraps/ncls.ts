import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// ncls1.com affiliate click (ncls1.com/irk?enk=<encoded ids>&subid=<site>&d=<target>). Not included
// in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapNcls: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'ncls1.com') || url.pathname !== '/irk') {
    return
  }

  // A click nested unencoded in `d` spills its own `d` into this query, so the last one holds the
  // target.
  const target = url.searchParams.getAll('d').at(-1)

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
