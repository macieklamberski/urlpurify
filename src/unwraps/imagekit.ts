import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const sourcePathRegex = /^\/.*?(?<source>https?(?::|%(?:25)?3a).+)$/i

// ImageKit web proxy (ik.imagekit.io/<id>/[tr:<options>/]<source>).
// Opt-in: unwrapping swaps the resized or optimized copy for the original image.
export const unwrapImagekit = createUnwrapper({
  hosts: 'ik.imagekit.io',
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const source = sourcePathRegex.exec(url.pathname)?.groups?.source

    if (!source) {
      return
    }

    return resolvePathTarget(url, source)
  },
})
