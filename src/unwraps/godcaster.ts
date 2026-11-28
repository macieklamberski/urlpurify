import { createPathUnwrapper } from '../pathTarget.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

// The first number is the show, as in the show's feeds.godcaster.fm/player_<n>.xml.
const episodePrefixRegex = /^\/act\/e\/\d+\/\d+\/\d+\//i
const supportPathRegex = /^\/act\/(?:sr\/\d+|fr\/\d+\/\d+)$/i

const hosts = ['go.godcaster.fm']

const extractSupportTarget = createQueryUnwrapper({
  hosts,
  path: supportPathRegex,
  params: ['d'],
})

const extractEpisodeTarget = createPathUnwrapper({
  hosts,
  prefix: episodePrefixRegex,
})

// Godcaster download measurement prefix (go.godcaster.fm/act/e/<show>/<n>/<n>/<target>), where the
// target is percent-encoded twice, and its show-notes click counter
// (go.godcaster.fm/act/sr/<show>?d=<target>, also /act/fr/<show>/<n>?d=<target>).
// Opt-in: unwrapping removes the podcaster's download counts.
export const unwrapGodcaster = createUnwrapper({
  hosts,
  unwrap: (url) => {
    return extractSupportTarget(url) ?? extractEpisodeTarget(url)
  },
})
