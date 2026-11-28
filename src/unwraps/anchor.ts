import { createPathUnwrapper } from '../pathTarget.js'

// Ad-inserted episodes carry `sponsor/<ids>/` before the target.
const playPrefixRegex = /^\/s\/[^/]+\/podcast\/play\/[^/]+\/(?:sponsor\/[^/]+\/)?/i

// Spotify for Podcasters download prefix (anchor.fm/s/<show>/podcast/play/<episode>/<target>,
// also with sponsor/<ids>/ before the target), where the target is raw or percent-encoded once or
// twice. Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapAnchor = createPathUnwrapper({
  hosts: ['anchor.fm', 'www.anchor.fm'],
  prefix: playPrefixRegex,
})
