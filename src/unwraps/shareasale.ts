import { createParamExtractor } from '../utils.js'

// ShareASale affiliate redirect (shareasale.com/r.cfm?urllink=<target>).
export const unwrapShareasale = createParamExtractor({
  hosts: ['shareasale.com', 'www.shareasale.com'],
  path: '/r.cfm',
  params: ['urllink'],
})
