import { createQueryUnwrapper } from '../utils.js'

// Podcast Ready subscribe button (www.podcastready.com/oneclick_bookmark.php?url=<feed>), a dead
// service.
// Opt-in: the link added the feed to a Podcast Ready account, not redirected to it.
export const unwrapPodcastReady = createQueryUnwrapper({
  hosts: ['podcastready.com', 'www.podcastready.com'],
  path: '/oneclick_bookmark.php',
  params: ['url'],
  ignoreLinkFragment: true,
})
