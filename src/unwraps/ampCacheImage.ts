import { isHostOrSubdomainOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const pathRegex = /^\/(?:i|ii\/[^/]+)\/(?<secure>s\/)?(?<target>.+)$/i

// AMP cache image (cdn.ampproject.org/i/[s/]<hostname>/<path>), and its resized copy under
// `/ii/<options>/`, such as `/ii/w680/` or `/ii/AW/`. The `s/` segment marks an https source.
// Not included in defaultUnwrappers: unwrapping swaps the cached copy for the original image.
export const unwrapAmpCacheImage: UrlUnwrapper = createUnwrapper(
  'cdn.ampproject.org',
  isHostOrSubdomainOf,
  (url) => {
    const match = url.pathname.match(pathRegex)

    if (!match?.groups) {
      return
    }

    const scheme = match.groups.secure ? 'https' : 'http'

    return `${scheme}://${match.groups.target}${url.search}${url.hash}`
  },
)
