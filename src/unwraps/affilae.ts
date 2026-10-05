import type { UrlUnwrapper } from '../types.js'

// Affilae affiliate click (lb.affilae.com/r/?p=<program id>&af=<id>&lp=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapAffilae: UrlUnwrapper = (url) => {
  if (url.hostname !== 'lb.affilae.com' || url.pathname !== '/r/') {
    return
  }

  // An Affilae click nested unencoded in `lp` spills its own `lp` into this query, so the last
  // one holds the target.
  return url.searchParams.getAll('lp').at(-1)
}
