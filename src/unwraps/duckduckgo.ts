import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

// DuckDuckGo search-result redirect (duckduckgo.com/l/?uddg=<target>).
export const unwrapDuckduckgo: UrlUnwrapper = createQueryUnwrapper({
  hosts: ['duckduckgo.com', 'www.duckduckgo.com', 'r.duckduckgo.com'],
  path: '/l/',
  params: ['uddg'],
})
