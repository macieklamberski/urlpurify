import { createParamExtractor } from '../utils.js'

// Tumblr outbound redirect (t.umblr.com/redirect?z=<target>), on every umblr.com subdomain.
export const unwrapTumblr = createParamExtractor({
  domains: 'umblr.com',
  path: '/redirect',
  params: ['z'],
})
