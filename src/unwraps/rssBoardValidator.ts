import { createQueryUnwrapper } from '../utils.js'

// RSS Advisory Board feed validator ((www.)rssboard.org/rss-validator/check.cgi?url=<feed>).
// Opt-in: unwrapping returns the feed, not the validator's report on it.
export const unwrapRssBoardValidator = createQueryUnwrapper({
  hosts: ['rssboard.org', 'www.rssboard.org'],
  path: '/rss-validator/check.cgi',
  params: ['url'],
  ignoreLinkFragment: true,
})
