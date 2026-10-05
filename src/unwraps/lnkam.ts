import { createParamExtractor } from '../utils.js'

// lnkam campaign click (go.lnkam.com/link/r?campaign_id=<id>&u=<target>). Not included in
// defaultUnwrappers: the click is a measured campaign or affiliate referral.
export const unwrapLnkam = createParamExtractor({
  hosts: 'go.lnkam.com',
  path: '/link/r',
  params: ['u'],
})
