import { resolveUrl } from 'trousse'
import { resolvePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// The resizing source is an absolute url or a path on the zone's own origin.
const imagePathRegex = /^\/cdn-cgi\/image\/[^/]+\/(?<source>.+)$/i
const plainPathRegex = /^\/cdn-cgi\/plain\/(?<source>https?(?::|%3a).+)$/i

// Cloudflare image paths on any zone, in two shapes:
// - Image Resizing (<zone>/cdn-cgi/image/<options>/<source>).
// - Passthrough (<zone>/cdn-cgi/plain/<source>).
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapCloudflareImages: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const image = url.pathname.match(imagePathRegex)?.groups?.source

    if (image) {
      return resolveUrl(resolvePathTarget(url, image), url.origin)
    }

    const plain = url.pathname.match(plainPathRegex)?.groups?.source

    if (!plain) {
      return
    }

    return resolvePathTarget(url, plain)
  },
})
