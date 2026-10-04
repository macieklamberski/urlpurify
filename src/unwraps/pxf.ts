import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const linkPathRegex = /^\/(?:c\/\d+\/\d+.*|[A-Za-z0-9]+)?$/

const extractTarget = createParamExtractor({
  hosts: /\.pxf\.io$/,
  params: ['u'],
})

// Impact Radius / pxf.io affiliate redirect (<merchant>.pxf.io/?u=<target>, also /<code> and
// /c/<id>/<id>/<id>).
export const unwrapPxf: UrlUnwrapper = (url) => {
  if (!linkPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
