import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// Federated Media ad click (r1.fmpub.net/?k1=<id>&k2=<id>&r=<target>). Not included in
// defaultUnwrappers: an ad click pays the publisher.
export const unwrapFederatedMedia: UrlUnwrapper = createParamExtractor({
  hosts: 'r1.fmpub.net',
  path: '/',
  params: ['r'],
})
