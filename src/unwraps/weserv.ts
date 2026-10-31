import { decodePercent, getQueryParamValues, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const weservHosts = ['images.weserv.nl', 'wsrv.nl']

// weserv image proxy (wsrv.nl/?url=<source>). weserv reads a raw `+` in the source literally.
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapWeserv: UrlUnwrapper = (url) => {
  if (!isHostOf(url, weservHosts) || url.pathname !== '/') {
    return
  }

  const value = getQueryParamValues(url, 'url', { decodeValues: false }).at(-1)

  if (!value) {
    return
  }

  return decodePercent(value)
}
