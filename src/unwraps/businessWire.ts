import { createParamExtractor } from '../utils.js'

// Business Wire release click tracker (cts.businesswire.com/ct/CT?url=<target>).
export const unwrapBusinessWire = createParamExtractor({
  hosts: 'cts.businesswire.com',
  path: '/ct/CT',
  params: ['url'],
})
