import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const sourcePathRegex = /^\/.*?(?<source>https?(?::|%(?:25)?3a).+)$/i

// Hatena image scaler (cdn.image.st-hatena.com/image/scale/<signature>/<options>/<source>).
// Opt-in: unwrapping swaps the resized or optimized copy for the original image.
export const unwrapHatenaImage = createUnwrapper({
  hosts: 'cdn.image.st-hatena.com',
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const source = sourcePathRegex.exec(url.pathname)?.groups?.source

    if (!source) {
      return
    }

    return resolvePathTarget(url, source)
  },
})
