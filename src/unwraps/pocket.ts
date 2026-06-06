import { createParamExtractor } from '../utils.js'

// Pocket redirect (getpocket.com/redirect?url=<target>).
export const unwrapPocket = createParamExtractor({
  hosts: 'getpocket.com',
  path: '/redirect',
  params: ['url'],
})
