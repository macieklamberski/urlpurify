import { decodePercent, isHostOf, resolveUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getRawParamValues } from '../utils.js'

const weservHosts = ['images.weserv.nl', 'wsrv.nl']
// weserv reads `ssl:<host>/<path>` as an https source.
const sslPrefixRegex = /^ssl:/i

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

  const source = decodePercent(value).replace(sslPrefixRegex, 'https://')

  // weserv reads a source without a scheme, `<host>/<path>`, as a host.
  if (!source.startsWith('/')) {
    return source
  }

  return resolveUrl(source, url.origin)
}
