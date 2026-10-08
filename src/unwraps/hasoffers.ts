import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

// HasOffers (TUNE) affiliate click on any host
// (<network>.go2cloud.org/aff_c?offer_id=<id>&aff_id=<id>&url=<target>).
// Opt-in: unwrapping removes the publisher's commission. Networks run it on their own hosts.
export const unwrapHasoffers: UrlUnwrapper = (url) => {
  if (url.pathname !== '/aff_c' || !url.searchParams.has('offer_id')) {
    return
  }

  const target = getParamTarget(url, 'url')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
