import { isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getParamTarget } from '../utils.js'

// Apptrkr job-ad click tracker (apptrkr.com/get_redirect.php?id=<n>&targetURL=<target>).
// Not included in defaultUnwrappers: unwrapping drops the job board's click count for the ad.
export const unwrapApptrkr: UrlUnwrapper = createUnwrapper({
  hosts: 'apptrkr.com',
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/get_redirect.php')) {
      return
    }

    // An Apptrkr link nested unencoded in `targetURL` spills its own `targetURL` into this query,
    // so the last one holds the target.
    const target = getParamTarget(url, 'targetURL', -1)

    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
