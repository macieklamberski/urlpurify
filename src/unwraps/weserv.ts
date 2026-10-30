import { decodePercent, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getRawParamValues } from '../utils.js'

const weservHosts = ['images.weserv.nl', 'wsrv.nl']

// weserv image proxy (wsrv.nl/?url=<source>). weserv reads a raw `+` in the source literally.
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapWeserv: UrlUnwrapper = (url) => {
  if (!isHostOf(url, weservHosts) || url.pathname !== '/') {
    return
  }

  const value = getRawParamValues(url, 'url').at(-1)

  if (!value) {
    return
  }

  return decodePercent(value)
}
