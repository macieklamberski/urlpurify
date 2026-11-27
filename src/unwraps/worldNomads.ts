import { createQueryUnwrapper } from '../utils.js'

// World Nomads affiliate link (www.worldnomads.com/Turnstile/AffiliateLink?partnerCode=<id>&path=
// <target>, also /af.aspx?affiliate=<id>&path=<target>). Not included in defaultUnwrappers:
// unwrapping drops the publisher's commission.
export const unwrapWorldNomads = createQueryUnwrapper({
  hosts: 'www.worldnomads.com',
  path: ['/Turnstile/AffiliateLink', '/af.aspx'],
  params: ['path'],
  // A Turnstile link nested unencoded in `path` spills its own `path` into this query, so the
  // last one holds the target.
  index: -1,
})
