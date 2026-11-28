import { resolvePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const pathRegex = /^\/(?:i|ii\/[^/]+)\/(?<secure>s\/)?(?<target>.+)$/i

// AMP cache image (cdn.ampproject.org/i/[s/]<hostname>/<path>), and its resized copy under
// `/ii/<options>/`, such as `/ii/w680/` or `/ii/AW/`. The `s/` segment marks an https source.
// Not included in defaultUnwrappers: unwrapping swaps the cached copy for the original image.
export const unwrapAmpCacheImage: UrlUnwrapper = createUnwrapper({
  domains: 'cdn.ampproject.org',
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const match = url.pathname.match(pathRegex)

    if (!match?.groups) {
      return
    }

    return resolvePathTarget(url, match.groups.target, match.groups.secure ? 'https:' : 'http:')
  },
})
