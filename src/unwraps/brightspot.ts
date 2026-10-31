import { decodePercent, getQueryParamValues, isSubdomainOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const dimsPathRegex = /^\/dims\d\/.*$/i

// Brightspot image resizer on a publisher's subdomain
// (<publisher>.brightspotcdn.com/dims4/<options>/?url=<source>).
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapBrightspot: UrlUnwrapper = (url) => {
  if (!isSubdomainOf(url, 'brightspotcdn.com') || !dimsPathRegex.test(url.pathname)) {
    return
  }

  const value = getQueryParamValues(url, 'url', { decodeValues: false }).at(-1)

  if (!value) {
    return
  }

  return decodePercent(value)
}
