import { createQueryUnwrapper } from '../utils.js'

// Windows Live subscribe button (www.live.com/?add=<feed>, also on live.com).
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapWindowsLive = createQueryUnwrapper({
  hosts: ['live.com', 'www.live.com'],
  path: '/',
  params: ['add'],
  ignoreLinkFragment: true,
})
