import { hasQueryParam, isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

// Elastic Email click tracker, on its own <code>.trk.elasticemail.com hosts and on senders' custom
// tracking domains (tracking.<sender domain>/tracking/click?msgid=<id>&target=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapElasticEmail: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/tracking/click') || !hasQueryParam(url, 'msgid')) {
      return
    }

    const target = readParamTarget(url, 'target')

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  },
})
