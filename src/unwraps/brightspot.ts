import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const dimsPathRegex = /^\/dims\d\/.*$/i

// Brightspot dims image resizer on any host: its own brightspotcdn.com subdomains and the
// publishers' domains (<host>/dims4/<options>/?url=<source>), such as dims.apnews.com.
// Not included in defaultUnwrappers: unwrapping swaps the resized copy for the original image.
export const unwrapBrightspot: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!dimsPathRegex.test(url.pathname)) {
      return
    }

    const source = readParamTarget(url, 'url', { index: -1, plus: 'keep' })

    // On any host, only an http source tells the resizer from another site's /dims4/ path.
    if (!source || !isHttpUrl(source)) {
      return
    }

    return source
  },
})
