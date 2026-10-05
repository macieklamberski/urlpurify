import { createParamExtractor } from '../utils.js'

// Proofpoint TAP URL Isolation link rewriting in email
// (urlisolation.com/browser?clickId=<id>&traceToken=<token>&url=<target>).
// Opt-in: an email security gateway. The link answers 302 to a sign-in page, so unwrapping
// skips the login wall.
export const unwrapProofpointIsolation = createParamExtractor({
  hosts: 'urlisolation.com',
  path: '/browser',
  params: ['url'],
})
