import { createQueryUnwrapper } from '../utils.js'

// FeedLand single-feed river and feed info page (feedland.org/?river=<feed>,
// feedland.org/?feedurl=<feed>).
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapFeedland = createQueryUnwrapper({
  hosts: [
    'feedland.org',
    'www.feedland.org',
    'blue.feedland.org',
    'feedland.com',
    'www.feedland.com',
  ],
  path: '/',
  params: ['river', 'feedurl'],
  ignoreLinkFragment: true,
})
