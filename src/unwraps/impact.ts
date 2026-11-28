import { isHttpUrl, isSubdomainOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const pathRegex = /^\/c\/\d+\/\d+\/\d+$/i
const sjvPathRegex = /^\/[A-Za-z0-9]{5,6}$/
const pxfPathRegex = /^\/(?:c\/\d+\/\d+.*|[A-Za-z0-9]+)?$/i

// Impact click tracker on any host (<host>/c/<publisher id>/<ad id>/<campaign id>?u=<target>),
// /<short code>?u= on its sjv.io and pxf.io click domains, and /?u= or a longer /c/ path on pxf.io.
// Opt-in: unwrapping removes the publisher's commission. Merchants run it on their own hosts.
export const unwrapImpact = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    const isSjvPath = isSubdomainOf(url, 'sjv.io') && sjvPathRegex.test(url.pathname)
    const isPxfPath = isSubdomainOf(url, 'pxf.io') && pxfPathRegex.test(url.pathname)

    if (!pathRegex.test(url.pathname) && !isSjvPath && !isPxfPath) {
      return
    }

    const target = readParamTarget(url, 'u')

    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
