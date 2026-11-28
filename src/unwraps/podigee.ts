import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const sourcePathRegex = /^\/.*?(?<source>https?(?::|%(?:25)?3a).+)$/i

// Podigee image resizer for podcast art (images.podigee-cdn.net/<options>/<source>).
// Opt-in: unwrapping swaps the resized or optimized copy for the original image.
export const unwrapPodigee = createUnwrapper({
  subdomains: 'podigee-cdn.net',
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const source = sourcePathRegex.exec(url.pathname)?.groups?.source

    if (!source) {
      return
    }

    return resolvePathTarget(url, source)
  },
})
