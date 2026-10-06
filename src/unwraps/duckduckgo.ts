import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// DuckDuckGo search-result redirect (duckduckgo.com/l/?uddg=<target>).
export const unwrapDuckduckgo: UrlUnwrapper = createParamExtractor({
  hosts: ['duckduckgo.com', 'r.duckduckgo.com'],
  path: '/l/',
  params: ['uddg'],
})
