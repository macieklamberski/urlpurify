import { createParamExtractor } from '../utils.js'

// Instagram outbound link shim (l.instagram.com/?u=<target>, also lm.), on instagram.com and
// every subdomain.
export const unwrapInstagramShim = createParamExtractor({
  domains: 'instagram.com',
  path: '/',
  params: ['u'],
})
