import { createPathUnwrapper } from '../pathTarget.js'

const episodePrefixRegex = /^\/e\//i

// Podsights, now Spotify Ad Analytics, download measurement prefix (pdst.fm/e/<target>, also
// prfx.byspotify.com/e/<target>), where the target often drops its scheme.
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapPodsights = createPathUnwrapper({
  hosts: ['pdst.fm', 'prfx.byspotify.com'],
  prefix: episodePrefixRegex,
  scheme: 'link',
})
