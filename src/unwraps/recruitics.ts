import { createParamExtractor } from '../utils.js'

// Recruitics job-listings redirect (jsv3.recruitics.com/redirect?rx_url=<target>), on
// recruitics.com and its subdomains.
export const unwrapRecruitics = createParamExtractor({
  domains: 'recruitics.com',
  path: '/redirect',
  params: ['rx_url'],
})
