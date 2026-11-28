import { createQueryUnwrapper } from '../utils.js'

// Proofpoint TAP URL Isolation link rewriting in email
// (urlisolation.com/browser?clickId=<id>&traceToken=<token>&url=<target>).
// Opt-in: unwrapping skips the gateway's click-time check of the target. The link answers 302 to a
// sign-in page, so unwrapping skips the login wall.
export const unwrapProofpointIsolation = createQueryUnwrapper({
  hosts: ['urlisolation.com', 'www.urlisolation.com'],
  path: '/browser',
  params: ['url'],
})
