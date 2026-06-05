import { createParamExtractor } from '../utils.js'

// YouTube external redirect (www.youtube.com/redirect?q=<target>).
export const unwrapYouTube = createParamExtractor({
  hosts: 'www.youtube.com',
  path: '/redirect',
  params: ['q'],
})
