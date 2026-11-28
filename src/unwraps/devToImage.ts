import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const sourcePathRegex = /^\/dynamic\/image\/.*?(?<source>https?(?::|%(?:25)?3a).+)$/i

// dev.to image optimizer (media2.dev.to/dynamic/image/<options>/<source>).
// Opt-in: unwrapping swaps the resized copy for the original image.
export const unwrapDevToImage = createUnwrapper({
  subdomains: 'dev.to',
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const source = sourcePathRegex.exec(url.pathname)?.groups?.source

    if (!source) {
      return
    }

    return resolvePathTarget(url, source)
  },
})
