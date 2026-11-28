import { hasQueryParam, isAnyOf, isHttpUrl } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

// HasOffers (TUNE) affiliate click on any host
// (<network>.go2cloud.org/aff_c?offer_id=<id>&aff_id=<id>&url=<target>).
// Opt-in: unwrapping drops the publisher's commission. Networks run it on their own hosts.
export const unwrapHasoffers = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/aff_c') || !hasQueryParam(url, 'offer_id')) {
      return
    }

    const target = readParamTarget(url, 'url')

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  },
})
