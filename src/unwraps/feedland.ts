import { createParamExtractor } from '../utils.js'

// FeedLand single-feed river and feed info page (feedland.org/?river=<feed>,
// feedland.org/?feedurl=<feed>). Opt-in in the subscribe intent group: the river shows the feed's
// items inside FeedLand and the info page offers to subscribe to it, neither redirects to the feed.
export const unwrapFeedland = createParamExtractor({
  hosts: ['feedland.org', 'blue.feedland.org', 'feedland.com'],
  path: '/',
  params: ['river', 'feedurl'],
})
