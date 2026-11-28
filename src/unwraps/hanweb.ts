import { readPathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

// The converter path, then the target host, with a doubled slash or the target's scheme kept.
const tunisPrefixRegex =
  /^\/tunis\/(?=\/?(?:https?(?::|%(?:25)?3a)(?:\/|%(?:25)?2f)+)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/|%(?:25)?2f|$))/i

// HanWEB Simplified Chinese converter (<host>[:<port>]/TuniS/<target host>/<path>), which serves
// a page converted from Traditional Chinese. Hong Kong government and public sites run it on a
// host of their own, such as sc.isd.gov.hk, sc.news.gov.hk or gbcode.rthk.hk.
// Opt-in: unwrapping returns the live page, not the copy.
export const unwrapHanweb = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    const target = readPathTarget(url, tunisPrefixRegex)

    if (!target) {
      return
    }

    return target
  },
})
