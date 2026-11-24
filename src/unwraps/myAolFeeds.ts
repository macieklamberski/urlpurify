import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

// My AOL feeds subscribe button (feeds.my.aol.com/add.jsp?url=<feed>). Not in defaultUnwrappers:
// the link adds the feed to a My AOL page, it does not redirect to it.
export const unwrapMyAolFeeds: UrlUnwrapper = createQueryUnwrapper({
  hosts: ['feeds.my.aol.com'],
  path: '/add.jsp',
  params: ['url'],
  ignoreLinkFragment: true,
})
