import { createQueryUnwrapper } from '../utils.js'

const linkPathRegex = /^\/(?:s\/[0-9a-f]+\/[\w-]+|x\/[\w-]+)$/i

// EdgePilot email link rewriting (link.edgepilot.com/s/<id>/<id>?u=<target>, also /x/<id>).
// Opt-in: unwrapping skips the gateway's click-time check of the target.
export const unwrapEdgepilot = createQueryUnwrapper({
  hosts: 'link.edgepilot.com',
  path: linkPathRegex,
  params: ['u'],
})
