import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const linkPathRegex = /^\/(?:s\/[0-9a-f]+\/[\w-]+|x\/[\w-]+)$/

const extractTarget = createParamExtractor({
  hosts: 'link.edgepilot.com',
  params: ['u'],
})

// EdgePilot email link rewriting (link.edgepilot.com/s/<id>/<id>?u=<target>, also /x/<id>).
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapEdgepilot: UrlUnwrapper = (url) => {
  if (!linkPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
