import { createQueryUnwrapper } from '../utils.js'

// RSS Advisory Board feed validator ((www.)rssboard.org/rss-validator/check.cgi?url=<feed>).
// Opt-in: unwrapping returns the feed the tool was given, not the tool's view of it.
export const unwrapRssBoardValidator = createQueryUnwrapper({
  hosts: ['rssboard.org', 'www.rssboard.org'],
  path: '/rss-validator/check.cgi',
  params: ['url'],
  ignoreLinkFragment: true,
})
