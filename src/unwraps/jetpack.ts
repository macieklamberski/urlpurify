import { decodePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const hosts = ['i0.wp.com', 'i1.wp.com', 'i2.wp.com', 'i3.wp.com']

const sourcePathRegex = /^\/(?<source>.+)$/

// Jetpack image CDN (i0.wp.com/<host>/<path>), which drops the source's scheme. Its own query holds
// only resize options. Not included in defaultUnwrappers: unwrapping swaps the resized copy for
// the original image.
export const unwrapJetpack: UrlUnwrapper = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    const source = url.pathname.match(sourcePathRegex)?.groups?.source

    if (!source) {
      return
    }

    return decodePathTarget(source)
  },
})
