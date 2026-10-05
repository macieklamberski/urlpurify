import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPathRegex = /^\/(?:e1t|s[12]t)\/c\/5\/[^/]+$/

const extractTarget = createParamExtractor({
  hosts: /^t\.sidekickopen\d+\.com$/,
  params: ['t'],
})

// HubSpot Sidekick email click tracker (t.sidekickopen<n>.com/e1t/c/5/<id>?t=<target>, also
// /s1t/ and /s2t/).
// Not included in defaultUnwrappers: unwrapping drops the sender's click count.
export const unwrapHubspotSidekick: UrlUnwrapper = (url) => {
  if (!clickPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
