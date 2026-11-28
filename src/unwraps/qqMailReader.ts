import { createQueryUnwrapper } from '../utils.js'

// QQ Mail reader subscribe link (mail.qq.com/cgi-bin/feed?u=<feed>).
// Opt-in: the link adds the feed to a QQ Mail account, it never redirects to it.
export const unwrapQqMailReader = createQueryUnwrapper({
  hosts: 'mail.qq.com',
  path: '/cgi-bin/feed',
  params: ['u'],
  ignoreLinkFragment: true,
})
