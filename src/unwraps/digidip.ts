import { isAnyOf } from 'trousse'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const paths = ['/visit', '/v1/redirect']

const extractTarget = createQueryUnwrapper({
  hosts: /\.digidip\.net$/,
  params: ['url'],
})

// digidip affiliate redirect (<publisher>.digidip.net/visit?url=<target> and
// tracking.r.digidip.net/v1/redirect?url=<target>).
export const unwrapDigidip = createUnwrapper({
  subdomains: 'digidip.net',
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, paths)) {
      return
    }

    return extractTarget(url)
  },
})
