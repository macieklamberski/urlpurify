import { createParamExtractor } from '../utils.js'

// Dognet affiliate click (go.dognet.com/?chid=<id>&url=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapDognet = createParamExtractor({
  hosts: 'go.dognet.com',
  path: '/',
  params: ['url'],
})
