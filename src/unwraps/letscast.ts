import { createPathUnwrapper } from '../pathTarget.js'

const trackPrefixRegex = /^\/track\//i

// LetsCast download measurement prefix (letscast.fm/track/<target>). The target is LetsCast's own
// audio server, such as lc.podcast-hosting.org/<path>, which serves the file itself.
// Opt-in: unwrapping removes the podcaster's download counts.
export const unwrapLetscast = createPathUnwrapper({
  hosts: ['letscast.fm', 'www.letscast.fm'],
  prefix: trackPrefixRegex,
})
