import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const paths = ['/visit', '/v1/redirect']

const extractTarget = createQueryUnwrapper({
  hosts: /\.digidip\.net$/,
  params: ['url'],
})

// digidip affiliate redirect (<publisher>.digidip.net/visit?url=<target> and
// tracking.r.digidip.net/v1/redirect?url=<target>).
export const unwrapDigidip: UrlUnwrapper = (url) => {
  if (!isAnyOf(url.pathname, paths)) {
    return
  }

  return extractTarget(url)
}
