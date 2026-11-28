import { createQueryUnwrapper } from '../utils.js'

// Recruitics job-listings redirect (jsv3.recruitics.com/redirect?rx_url=<target>).
// Opt-in: unwrapping removes the click attribution.
export const unwrapRecruitics = createQueryUnwrapper({
  hosts: 'jsv3.recruitics.com',
  path: '/redirect',
  params: ['rx_url'],
})
