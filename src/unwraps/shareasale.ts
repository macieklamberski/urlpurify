import { createQueryUnwrapper } from '../utils.js'

// ShareASale affiliate redirect (shareasale.com/r.cfm?urllink=<target>).
export const unwrapShareasale = createQueryUnwrapper({
  hosts: ['shareasale.com', 'www.shareasale.com'],
  path: '/r.cfm',
  params: ['urllink'],
})
