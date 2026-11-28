import { createQueryUnwrapper } from '../utils.js'

// Lever Analytics email click tracker (t.lever-analytics.com/email-link?dest=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapLeverAnalytics = createQueryUnwrapper({
  hosts: 't.lever-analytics.com',
  path: '/email-link',
  params: ['dest'],
})
