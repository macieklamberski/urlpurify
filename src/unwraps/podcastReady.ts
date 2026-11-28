import { createQueryUnwrapper } from '../utils.js'

// Podcast Ready subscribe button (www.podcastready.com/oneclick_bookmark.php?url=<feed>), a dead
// service.
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapPodcastReady = createQueryUnwrapper({
  hosts: ['podcastready.com', 'www.podcastready.com'],
  path: '/oneclick_bookmark.php',
  params: ['url'],
  ignoreLinkFragment: true,
})
