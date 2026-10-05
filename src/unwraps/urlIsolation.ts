import { createParamExtractor } from '../utils.js'

// urlisolation.com remote browser isolation link rewriting in email
// (urlisolation.com/browser?clickId=<id>&traceToken=<token>&url=<target>).
// Opt-in: an email security gateway, unwrapping skips the isolated viewer.
export const unwrapUrlIsolation = createParamExtractor({
  hosts: 'urlisolation.com',
  path: '/browser',
  params: ['url'],
})
