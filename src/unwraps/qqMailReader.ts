import { createQueryUnwrapper } from '../utils.js'

// QQ Mail reader subscribe link (mail.qq.com/cgi-bin/feed?u=<feed>).
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapQqMailReader = createQueryUnwrapper({
  hosts: 'mail.qq.com',
  path: '/cgi-bin/feed',
  params: ['u'],
  ignoreLinkFragment: true,
})
