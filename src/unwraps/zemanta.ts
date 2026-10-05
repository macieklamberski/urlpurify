import { createParamExtractor } from '../utils.js'

// Zemanta related-article redirect (r.zemanta.com/?u=<target>&a=<id>&rid=<uuid>&e=<hash>).
export const unwrapZemanta = createParamExtractor({
  hosts: 'r.zemanta.com',
  path: '/',
  params: ['u'],
})
