import { createQueryUnwrapper } from '../utils.js'

const clickPathRegex = /^\/(?:e1t|s[12]t)\/c\/5\/[^/]+$/i

// HubSpot Sidekick and Signals click tracker (t.sidekickopen<n>.com/e1t/c/5/<id>?t=<target>, also
// /s1t/, /s2t/ and the same paths on t.signauxtrois.com and its sibling hosts).
// Not included in defaultUnwrappers: unwrapping drops the sender's click count.
export const unwrapHubspotSidekick = createQueryUnwrapper({
  hosts:
    /^t\.(?:sidekickopen\d+|senalquatro|signaledue|signalecinque|signaletre|signauxdeux|signauxdix|signauxquatre|signauxsept|signauxtrois)\.com$/,
  path: clickPathRegex,
  params: ['t'],
})
