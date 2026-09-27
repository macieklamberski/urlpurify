import { createParamExtractor } from '../utils.js'

// Narrativ influencer-affiliate redirect (api.narrativ.com or narrativ.com with ?url=<target>).
// Not included in defaultUnwrappers: Narrativ uses real-time auction
// bidding to route clicks to the highest-bidding retailer, so the embedded
// `url` may not be where the click actually lands. Opt in by passing a custom
// unwrappers array.
export const unwrapNarrativ = createParamExtractor({
  hosts: ['narrativ.com', 'api.narrativ.com'],
  params: ['url'],
})
