import { createParamExtractor } from '../utils.js'

// Disqus outbound link redirect (disq.us/?url=<target>).
export const unwrapDisqus = createParamExtractor({
  hosts: 'disq.us',
  params: ['url'],
})
