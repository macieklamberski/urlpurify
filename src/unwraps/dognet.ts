import { createQueryUnwrapper } from '../utils.js'

// Dognet affiliate click (go.dognet.com/?chid=<id>&url=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapDognet = createQueryUnwrapper({
  hosts: 'go.dognet.com',
  path: '/',
  params: ['url'],
})
