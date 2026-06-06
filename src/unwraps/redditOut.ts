import { createParamExtractor } from '../utils.js'

// Reddit outbound click tracker (out.reddit.com/?url=<target>).
export const unwrapRedditOut = createParamExtractor({
  hosts: 'out.reddit.com',
  params: ['url'],
})
