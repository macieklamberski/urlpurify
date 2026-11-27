import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const linkPathRegex = /^\/(?:s\/[0-9a-f]+\/[\w-]+|x\/[\w-]+)$/i

const hosts = ['link.edgepilot.com']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['u'],
})

// EdgePilot email link rewriting (link.edgepilot.com/s/<id>/<id>?u=<target>, also /x/<id>).
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapEdgepilot = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!linkPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
