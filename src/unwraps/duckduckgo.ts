import { createQueryUnwrapper } from '../utils.js'

// DuckDuckGo search-result redirect (duckduckgo.com/l/?uddg=<target>).
export const unwrapDuckduckgo = createQueryUnwrapper({
  hosts: ['duckduckgo.com', 'www.duckduckgo.com', 'r.duckduckgo.com'],
  path: '/l/',
  params: ['uddg'],
})
