import { createQueryUnwrapper } from '../utils.js'

// DuckDuckGo ad click (duckduckgo.com/y.js?u3=<target>, older links ?u2=<target>).
// Opt-in: unwrapping removes the click attribution.
export const unwrapDuckduckgoAds = createQueryUnwrapper({
  hosts: ['duckduckgo.com', 'www.duckduckgo.com'],
  path: '/y.js',
  params: ['u3', 'u2'],
})
