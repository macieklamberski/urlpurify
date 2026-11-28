import { createPathUnwrapper } from '../pathTarget.js'

const prefixRegex = /^\/v1\/[0-9a-f]{64}\//i

// Mozilla outgoing link redirector on Mozilla mailing lists, blogs and support forums
// (outgoing.mozilla.org/v1/<sha256>/<target>, also outgoing.prod.mozaws.net and
// prod.outgoing.prod.webservices.mozgcp.net).
export const unwrapMozillaOutgoing = createPathUnwrapper({
  hosts: [
    'outgoing.mozilla.org',
    'outgoing.prod.mozaws.net',
    'prod.outgoing.prod.webservices.mozgcp.net',
  ],
  prefix: prefixRegex,
})
