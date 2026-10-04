import { createParamExtractor } from '../utils.js'

// Match google.<TLD> with any optional subdomain. Real corpus traffic carries
// /url? redirects from maps., images., cse., plus., clients[1-9]., toolbarqueries.,
// ditu., posts., not just www.
export const googleHostRegex = /^(?:[a-z0-9-]+\.)*google\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/

// Google redirect (google.<TLD>/url?url=<target> or google.<TLD>/url?q=<target>).
export const unwrapGoogle = createParamExtractor({
  hosts: googleHostRegex,
  path: '/url',
  params: ['url', 'q'],
})
