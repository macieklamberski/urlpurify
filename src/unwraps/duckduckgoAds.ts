import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// DuckDuckGo ad click (duckduckgo.com/y.js?u3=<target>, older links ?u2=<target>).
// Not included in defaultUnwrappers: an ad click pays the publisher who showed the ad, and
// unwrapping removes that payment, the same cost as an affiliate wrapper.
export const unwrapDuckduckgoAds: UrlUnwrapper = createParamExtractor({
  hosts: 'duckduckgo.com',
  path: '/y.js',
  params: ['u3', 'u2'],
})
