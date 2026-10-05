import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamValues } from '../utils.js'

const ymlinkRegex = /^\d+$/

// YourMembership association email click tracker, served from each association's own domain
// (<association>/link.asp?e=<email>&job=<n>&ymlink=<n>&finalurl=<target>). A numeric `ymlink` and
// an http `finalurl` guard the shared path. Opt-in: unwrapping removes the sender's click count.
export const unwrapYourMembership: UrlUnwrapper = (url) => {
  if (url.pathname !== '/link.asp' || !ymlinkRegex.test(url.searchParams.get('ymlink') ?? '')) {
    return
  }

  const target = getParamValues(url, 'finalurl').at(0)

  if (target && isHttpUrl(target)) {
    return target
  }
}
