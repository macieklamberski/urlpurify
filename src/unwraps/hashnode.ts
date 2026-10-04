import { createParamExtractor } from '../utils.js'

// Hashnode outbound redirect (hashnode.com/util/redirect?url=<target>), on hashnode.com and every
// subdomain.
export const unwrapHashnode = createParamExtractor({
  domains: 'hashnode.com',
  path: '/util/redirect',
  params: ['url'],
})
