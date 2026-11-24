import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const unwrapFeed2jsOrg = createParamExtractor({
  hosts: ['feed2js.org', 'www.feed2js.org'],
  path: '/feed2js.php',
  params: ['src'],
  ignoreLinkFragment: true,
})

const unwrapFeedroll = createParamExtractor({
  hosts: ['feedroll.com', 'www.feedroll.com'],
  path: '/rssviewer/feed2js.php',
  params: ['src'],
  ignoreLinkFragment: true,
})

// Feed2JS feed widget ([www.]feed2js.org/feed2js.php?src=<feed>, and its copy on
// [www.]feedroll.com/rssviewer/feed2js.php?src=<feed>). Opt-in: the link returns a script that
// writes the feed into a page, not the feed.
export const unwrapFeed2js: UrlUnwrapper = (url) => {
  return unwrapFeed2jsOrg(url) ?? unwrapFeedroll(url)
}
