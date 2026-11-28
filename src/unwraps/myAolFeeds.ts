import { createQueryUnwrapper } from '../utils.js'

// My AOL feeds subscribe button (feeds.my.aol.com/add.jsp?url=<feed>).
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapMyAolFeeds = createQueryUnwrapper({
  hosts: 'feeds.my.aol.com',
  path: '/add.jsp',
  params: ['url'],
  ignoreLinkFragment: true,
})
