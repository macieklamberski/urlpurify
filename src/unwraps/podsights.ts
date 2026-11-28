import { createPathUnwrapper } from '../pathTarget.js'

const episodePrefixRegex = /^\/e\//i

// Podsights, now Spotify Ad Analytics, download measurement prefix (pdst.fm/e/<target>, also
// prfx.byspotify.com/e/<target>), where the target often drops its scheme.
// Opt-in: unwrapping removes the publisher's download counts.
export const unwrapPodsights = createPathUnwrapper({
  hosts: ['pdst.fm', 'www.pdst.fm', 'prfx.byspotify.com'],
  prefix: episodePrefixRegex,
  scheme: 'inherit',
})
