import { createQueryUnwrapper } from '../utils.js'

// DuckDuckGo ad click (duckduckgo.com/y.js?u3=<target>, older links ?u2=<target>).
// Opt-in: an ad click pays the publisher who showed the ad, and unwrapping removes that payment,
// the same cost as an affiliate wrapper.
export const unwrapDuckduckgoAds = createQueryUnwrapper({
  hosts: ['duckduckgo.com', 'www.duckduckgo.com'],
  path: '/y.js',
  params: ['u3', 'u2'],
})
