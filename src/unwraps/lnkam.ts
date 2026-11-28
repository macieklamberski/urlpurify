import { createQueryUnwrapper } from '../utils.js'

// lnkam campaign click (go.lnkam.com/link/r?campaign_id=<id>&u=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapLnkam = createQueryUnwrapper({
  hosts: 'go.lnkam.com',
  path: '/link/r',
  params: ['u'],
})
