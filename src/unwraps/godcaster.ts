import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, percentDecode } from '../utils.js'

// The first number is the show, as in the show's feeds.godcaster.fm/player_<n>.xml.
const episodePrefixRegex = /^\/act\/e\/\d+\/\d+\/\d+\//
const encodedSchemeRegex = /^https?%(?:25)?3A/i
const supportPathRegex = /^\/act\/(?:sr\/\d+|fr\/\d+\/\d+)$/

const extractSupportTarget = createParamExtractor({
  hosts: 'go.godcaster.fm',
  params: ['d'],
})

// Godcaster download measurement prefix (go.godcaster.fm/act/e/<show>/<n>/<n>/<target>), where the
// target is percent-encoded twice, and its show-notes click counter
// (go.godcaster.fm/act/sr/<show>?d=<target>, also /act/fr/<show>/<n>?d=<target>).
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapGodcaster: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'go.godcaster.fm')) {
    return
  }

  if (supportPathRegex.test(url.pathname)) {
    return extractSupportTarget(url)
  }

  const match = url.pathname.match(episodePrefixRegex)

  if (!match) {
    return
  }

  let target = url.pathname.slice(match[0].length)

  while (encodedSchemeRegex.test(target)) {
    target = percentDecode(target)
  }

  return `${target}${url.hash}`
}
