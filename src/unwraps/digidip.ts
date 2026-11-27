import { createQueryUnwrapper } from '../utils.js'

// digidip affiliate redirect (<publisher>.digidip.net/visit?url=<target> and
// tracking.r.digidip.net/v1/redirect?url=<target>).
export const unwrapDigidip = createQueryUnwrapper({
  subdomains: 'digidip.net',
  path: ['/visit', '/v1/redirect'],
  params: ['url'],
})
