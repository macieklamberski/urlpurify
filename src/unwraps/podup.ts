import { readPathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const mediaPrefixRegex = /^\/media\//i

// Podup download measurement prefix (traffic.podup.com/media/<target>), where the target drops its
// scheme and carries a `key` param holding the show and episode for the download count.
// Opt-in: unwrapping removes the publisher's download counts.
export const unwrapPodup = createUnwrapper({
  hosts: 'traffic.podup.com',
  unwrap: (url) => {
    // Podup forwards to the path alone on https, dropping the query.
    return readPathTarget(url, mediaPrefixRegex, undefined, '')
  },
})
