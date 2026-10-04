import { createParamExtractor } from '../utils.js'

// Pocket redirect (getpocket.com/redirect?url=<target>), on getpocket.com and its subdomains.
export const unwrapPocket = createParamExtractor({
  domains: 'getpocket.com',
  path: '/redirect',
  params: ['url'],
})
