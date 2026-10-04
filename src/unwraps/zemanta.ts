import { createParamExtractor } from '../utils.js'

// Zemanta related-article redirect (r.zemanta.com/?u=<target>&a=<id>&rid=<uuid>&e=<hash>), on
// every subdomain.
export const unwrapZemanta = createParamExtractor({
  domains: 'zemanta.com',
  path: '/',
  params: ['u'],
})
