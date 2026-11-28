import { getQueryParam, isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const ymlinkRegex = /^\d+$/

// YourMembership association email click tracker, served from each association's own domain
// (<association>/link.asp?e=<email>&job=<n>&ymlink=<n>&finalurl=<target>). A numeric `ymlink` and
// an http `finalurl` guard the shared path. Opt-in: unwrapping removes the sender's click count.
export const unwrapYourMembership: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (
      !isAnyOf(url.pathname, '/link.asp') ||
      !ymlinkRegex.test(getQueryParam(url, 'ymlink') ?? '')
    ) {
      return
    }

    const target = readParamTarget(url, 'finalurl')

    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
