import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const clickPathRegex = /^\/(?:e1t|s[12]t)\/c\/5\/[^/]+$/

const extractTarget = createParamExtractor({
  hosts:
    /^t\.(?:sidekickopen\d+|senalquatro|signaledue|signalecinque|signaletre|signauxdeux|signauxdix|signauxquatre|signauxsept|signauxtrois)\.com$/,
  params: ['t'],
})

// HubSpot Sidekick and Signals click tracker (t.sidekickopen<n>.com/e1t/c/5/<id>?t=<target>, also
// /s1t/, /s2t/ and the same paths on t.signauxtrois.com and its sibling hosts).
// Not included in defaultUnwrappers: unwrapping drops the sender's click count.
export const unwrapHubspotSidekick: UrlUnwrapper = (url) => {
  if (!clickPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
