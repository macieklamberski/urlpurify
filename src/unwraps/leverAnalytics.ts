import { createParamExtractor } from '../utils.js'

// Lever Analytics email click tracker (t.lever-analytics.com/email-link?dest=<target>).
export const unwrapLeverAnalytics = createParamExtractor({
  hosts: 't.lever-analytics.com',
  path: '/email-link',
  params: ['dest'],
})
