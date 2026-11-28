import { resolvePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const sourcePathRegex = /^\/.*?(?<source>https?(?::|%(?:25)?3a).+)$/i

// ImageKit web proxy (ik.imagekit.io/<id>/[tr:<options>/]<source>).
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapImagekit: UrlUnwrapper = createUnwrapper({
  hosts: 'ik.imagekit.io',
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const source = url.pathname.match(sourcePathRegex)?.groups?.source

    if (!source) {
      return
    }

    return resolvePathTarget(url, source)
  },
})
