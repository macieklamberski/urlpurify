import { createQueryUnwrapper } from '../utils.js'

// Netvibes subscribe button (www.netvibes.com/subscribe.php?url=<feed>).
// Opt-in: the link added the feed to a Netvibes dashboard, it never redirected to it.
export const unwrapNetvibes = createQueryUnwrapper({
  hosts: ['netvibes.com', 'www.netvibes.com'],
  path: '/subscribe.php',
  params: ['url'],
  ignoreLinkFragment: true,
})
