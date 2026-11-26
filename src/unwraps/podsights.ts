import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const episodePrefixRegex = /^\/e\//i

// Podsights, now Spotify Ad Analytics, download measurement prefix (pdst.fm/e/<target>, also
// prfx.byspotify.com/e/<target>), where the target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodsights: UrlUnwrapper = createUnwrapper({
  hosts: ['pdst.fm', 'prfx.byspotify.com'],
  unwrap: (url) => {
    return getPathTarget(url, episodePrefixRegex, url.protocol)
  },
})
