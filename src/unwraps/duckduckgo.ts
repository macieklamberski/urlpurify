import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const extractSearchResultTarget = createParamExtractor({
  hosts: ['duckduckgo.com', 'r.duckduckgo.com'],
  path: '/l/',
  params: ['uddg'],
})

const extractAdClickTarget = createParamExtractor({
  hosts: 'duckduckgo.com',
  path: '/y.js',
  params: ['u3', 'u2'],
})

// DuckDuckGo search-result redirect (duckduckgo.com/l/?uddg=<target>), and the ad click
// (duckduckgo.com/y.js?u3=<target>, older links ?u2=<target>).
export const unwrapDuckduckgo: UrlUnwrapper = (url) => {
  return extractSearchResultTarget(url) ?? extractAdClickTarget(url)
}
