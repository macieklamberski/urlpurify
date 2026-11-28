import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const extractFeed2jsOrg = createQueryUnwrapper({
  hosts: ['feed2js.org', 'www.feed2js.org'],
  path: '/feed2js.php',
  params: ['src'],
  ignoreLinkFragment: true,
})

const extractFeedroll = createQueryUnwrapper({
  hosts: ['feedroll.com', 'www.feedroll.com'],
  path: '/rssviewer/feed2js.php',
  params: ['src'],
  ignoreLinkFragment: true,
})

// Feed2JS feed widget ([www.]feed2js.org/feed2js.php?src=<feed>, and its copy on
// [www.]feedroll.com/rssviewer/feed2js.php?src=<feed>).
// Opt-in: the link returns a script that writes the feed into a page, not the feed.
export const unwrapFeed2js = createUnwrapper({
  hosts: ['feed2js.org', 'www.feed2js.org', 'feedroll.com', 'www.feedroll.com'],
  ignoreLinkFragment: true,
  unwrap: (url) => {
    return extractFeed2jsOrg(url) ?? extractFeedroll(url)
  },
})
