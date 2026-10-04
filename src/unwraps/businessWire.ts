import { createParamExtractor } from '../utils.js'

// Business Wire release click tracker (cts.businesswire.com/ct/CT?url=<target>), on the domain and
// every subdomain.
export const unwrapBusinessWire = createParamExtractor({
  domains: 'businesswire.com',
  path: '/ct/CT',
  params: ['url'],
})
