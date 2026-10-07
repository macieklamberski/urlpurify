import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamValues, percentDecode } from '../utils.js'

const encodedSchemeRegex = /^https?%3A/i

// Apptrkr job-ad click tracker (apptrkr.com/get_redirect.php?id=<n>&targetURL=<target>).
// Not included in defaultUnwrappers: unwrapping drops the job board's click count for the ad.
export const unwrapApptrkr: UrlUnwrapper = (url) => {
  if (url.hostname !== 'apptrkr.com' || url.pathname !== '/get_redirect.php') {
    return
  }

  // An Apptrkr link nested unencoded in `targetURL` spills its own `targetURL` into this query,
  // so the last one holds the target.
  let target = getParamValues(url, 'targetURL').at(-1)

  if (!target) {
    return
  }

  if (encodedSchemeRegex.test(target)) {
    target = percentDecode(target)
  }

  if (isHttpUrl(target)) {
    return target
  }
}
