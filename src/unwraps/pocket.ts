import { createQueryUnwrapper } from '../utils.js'

// Pocket redirect (getpocket.com/redirect?url=<target>).
export const unwrapPocket = createQueryUnwrapper({
  hosts: 'getpocket.com',
  path: '/redirect',
  params: ['url'],
})
