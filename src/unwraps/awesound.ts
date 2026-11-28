import { createPathUnwrapper } from '../pathTarget.js'

// The segment after click-auid is the show's id, and the target keeps its scheme.
const clickPrefixRegex = /^\/click-auid\/[^/]+\/(?=https?(?::|%(?:25)?3a))/i

// Awesound show-notes click counter (awesound.com/click-auid/<show id>/<target>, also on
// click.awesound.com), with the target unencoded in the path. Awesound now answers with a page on
// old.awesound.com instead of forwarding.
// Opt-in: unwrapping removes the publisher's download counts.
export const unwrapAwesound = createPathUnwrapper({
  hosts: ['awesound.com', 'www.awesound.com', 'click.awesound.com'],
  prefix: clickPrefixRegex,
})
