import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamValues, percentDecode } from '../utils.js'

const pathRegex = /^\/c\/\d+\/\d+\/\d+$/
const sjvHostRegex = /\.sjv\.io$/
const sjvPathRegex = /^\/[A-Za-z0-9]{5,6}$/
const pxfHostRegex = /\.pxf\.io$/
const pxfPathRegex = /^\/(?:c\/\d+\/\d+.*|[A-Za-z0-9]+)?$/
const encodedSchemeRegex = /^https?%3A/i

// Impact click tracker on any host (<host>/c/<publisher id>/<ad id>/<campaign id>?u=<target>),
// /<short code>?u= on its sjv.io and pxf.io click domains, and /?u= or a longer /c/ path on pxf.io.
// Opt-in: unwrapping removes the publisher's commission. Merchants run it on their own hosts.
export const unwrapImpact: UrlUnwrapper = (url) => {
  const isSjvPath = sjvHostRegex.test(url.hostname) && sjvPathRegex.test(url.pathname)
  const isPxfPath = pxfHostRegex.test(url.hostname) && pxfPathRegex.test(url.pathname)

  if (!pathRegex.test(url.pathname) && !isSjvPath && !isPxfPath) {
    return
  }

  let target = getParamValues(url, 'u').at(0)

  // A target encoded twice still holds an encoded scheme after one decode.
  if (target && encodedSchemeRegex.test(target)) {
    target = percentDecode(target)
  }

  if (target && isHttpUrl(target)) {
    return target
  }
}
