import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/(?:c\/\d+\/\d+\/\d+|[A-Za-z0-9]{5,6})$/

const extractTarget = createParamExtractor({
  hosts: /\.sjv\.io$/,
  params: ['u'],
})

// Sovrn / sjv.io affiliate redirect (<merchant>.sjv.io/c/<digits>/<digits>/<digits>?u=<target>,
// or a 5 or 6 character short id instead of the /c/ path).
export const unwrapSjv: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
