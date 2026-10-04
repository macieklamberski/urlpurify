import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const paths = ['/visit', '/v1/redirect']

const extractTarget = createParamExtractor({
  hosts: /\.digidip\.net$/,
  params: ['url'],
})

// digidip affiliate redirect (<publisher>.digidip.net/visit?url=<target> and
// tracking.r.digidip.net/v1/redirect?url=<target>).
export const unwrapDigidip: UrlUnwrapper = (url) => {
  if (!paths.includes(url.pathname)) {
    return
  }

  return extractTarget(url)
}
