import { createParamExtractor } from '../utils.js'

// ShareASale affiliate redirect (shareasale.com/r.cfm?urllink=<target>), on every subdomain.
export const unwrapShareasale = createParamExtractor({
  domains: 'shareasale.com',
  path: '/r.cfm',
  params: ['urllink'],
})
