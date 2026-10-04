import { createParamExtractor } from '../utils.js'

// Lever Analytics email click tracker (t.lever-analytics.com/email-link?dest=<target>), on
// lever-analytics.com and its subdomains.
export const unwrapLeverAnalytics = createParamExtractor({
  domains: 'lever-analytics.com',
  path: '/email-link',
  params: ['dest'],
})
