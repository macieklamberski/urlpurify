import { createQueryUnwrapper } from '../utils.js'

// Adtraction affiliate click (track.adtraction.com/t/t?a=<id>&as=<id>&url=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapAdtraction = createQueryUnwrapper({
  hosts: 'track.adtraction.com',
  path: '/t/t',
  params: ['url'],
})
