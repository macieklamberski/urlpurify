import { createParamExtractor } from '../utils.js'

// SBS-AD affiliate click (www2.sbs-ad.com/track/traffic.php?c=<site>-<id>-<id>&u=<target>). Not
// included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapSbsAd = createParamExtractor({
  hosts: 'www2.sbs-ad.com',
  path: '/track/traffic.php',
  params: ['u'],
})
