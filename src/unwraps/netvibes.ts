import { createQueryUnwrapper } from '../utils.js'

// Netvibes subscribe button (www.netvibes.com/subscribe.php?url=<feed>).
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapNetvibes = createQueryUnwrapper({
  hosts: ['netvibes.com', 'www.netvibes.com'],
  path: '/subscribe.php',
  params: ['url'],
  ignoreLinkFragment: true,
})
