import { resolveUrl } from 'trousse'
import { createUnwrapper, decodeEncodedScheme, getParamValues } from '../utils.js'

// A site with a base path serves the optimizer under it.
const imagePathRegex = /^(?:\/[^/]+)*\/_next\/image$/i

// Next.js image optimizer on any site (<site>/_next/image?url=<source>&w=<width>), the source
// absolute or a path on the site. Next.js reads a raw `+` in the source as a space.
// Opt-in: unwrapping swaps the resized copy for the original image.
export const unwrapNextImage = createUnwrapper({
  anyHost: true,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!imagePathRegex.test(url.pathname)) {
      return
    }

    // A path source is read raw, since it resolves on the site.
    const source = getParamValues(url, 'url', 'space').at(-1)

    if (!source) {
      return
    }

    return resolveUrl(decodeEncodedScheme(source), url.origin)
  },
})
