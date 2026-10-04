import { createParamExtractor } from '../utils.js'

// YouTube external redirect (www.youtube.com/redirect?q=<target>), on every subdomain.
export const unwrapYouTube = createParamExtractor({
  domains: 'youtube.com',
  path: '/redirect',
  params: ['q'],
})
