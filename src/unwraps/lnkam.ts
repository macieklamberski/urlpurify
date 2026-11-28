import { createQueryUnwrapper } from '../utils.js'

// lnkam campaign click (go.lnkam.com/link/r?campaign_id=<id>&u=<target>).
// Opt-in: the click is a measured campaign or affiliate referral.
export const unwrapLnkam = createQueryUnwrapper({
  hosts: 'go.lnkam.com',
  path: '/link/r',
  params: ['u'],
})
