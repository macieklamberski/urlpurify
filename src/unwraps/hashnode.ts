import { createParamExtractor } from '../utils.js'

// Hashnode outbound redirect (hashnode.com/util/redirect?url=<target>).
export const unwrapHashnode = createParamExtractor({
  hosts: 'hashnode.com',
  path: '/util/redirect',
  params: ['url'],
})
