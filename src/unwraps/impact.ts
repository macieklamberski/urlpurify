import { decodePercent, isHttpUrl, isSubdomainOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamValues } from '../utils.js'

const pathRegex = /^\/c\/\d+\/\d+\/\d+$/i
const sjvPathRegex = /^\/[A-Za-z0-9]{5,6}$/
const pxfPathRegex = /^\/(?:c\/\d+\/\d+.*|[A-Za-z0-9]+)?$/i
const encodedSchemeRegex = /^https?%3A/i

// Impact click tracker on any host (<host>/c/<publisher id>/<ad id>/<campaign id>?u=<target>),
// /<short code>?u= on its sjv.io and pxf.io click domains, and /?u= or a longer /c/ path on pxf.io.
// Opt-in: unwrapping removes the publisher's commission. Merchants run it on their own hosts.
export const unwrapImpact: UrlUnwrapper = (url) => {
  const isSjvPath = isSubdomainOf(url, 'sjv.io') && sjvPathRegex.test(url.pathname)
  const isPxfPath = isSubdomainOf(url, 'pxf.io') && pxfPathRegex.test(url.pathname)

  if (!pathRegex.test(url.pathname) && !isSjvPath && !isPxfPath) {
    return
  }

  let target = getParamValues(url, 'u').at(0)

  // A target encoded twice still holds an encoded scheme after one decode.
  if (target && encodedSchemeRegex.test(target)) {
    target = decodePercent(target)
  }

  if (target && isHttpUrl(target)) {
    return target
  }
}
