import { createQueryUnwrapper } from '../utils.js'

// Business Wire release click tracker (cts.businesswire.com/ct/CT?url=<target>).
export const unwrapBusinessWire = createQueryUnwrapper({
  hosts: 'cts.businesswire.com',
  path: '/ct/CT',
  params: ['url'],
})
