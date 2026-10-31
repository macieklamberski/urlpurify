import { decodePercent, resolveUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// The resizing source is an absolute url or a path on the zone's own origin.
const imagePathRegex = /^\/cdn-cgi\/image\/[^/]+\/(?<source>.+)$/i
const plainPathRegex = /^\/cdn-cgi\/plain\/(?<source>https?(?::|%3a).+)$/i

// Cloudflare image paths on any zone, in two shapes:
// - Image Resizing (<zone>/cdn-cgi/image/<options>/<source>).
// - Passthrough (<zone>/cdn-cgi/plain/<source>).
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapCloudflareImages: UrlUnwrapper = (url) => {
  const image = url.pathname.match(imagePathRegex)?.groups?.source

  if (image) {
    return resolveUrl(decodePercent(`${image}${url.search}${url.hash}`), url.origin)
  }

  const plain = url.pathname.match(plainPathRegex)?.groups?.source

  if (!plain) {
    return
  }

  return decodePercent(`${plain}${url.search}${url.hash}`)
}
