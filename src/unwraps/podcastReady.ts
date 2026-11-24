import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

// Podcast Ready subscribe button (www.podcastready.com/oneclick_bookmark.php?url=<feed>), a dead
// service. Not in defaultUnwrappers: the link added the feed to a Podcast Ready account, not
// redirected to it.
export const unwrapPodcastReady: UrlUnwrapper = createQueryUnwrapper({
  hosts: ['podcastready.com', 'www.podcastready.com'],
  path: '/oneclick_bookmark.php',
  params: ['url'],
  ignoreLinkFragment: true,
})
