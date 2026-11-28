import { createQueryUnwrapper } from '../utils.js'

const hosts = ['netvibes.com', 'www.netvibes.com']

// Netvibes subscribe button (www.netvibes.com/subscribe.php?url=<feed>).
// Opt-in: the link added the feed to a Netvibes dashboard, it never redirected to it.
export const unwrapNetvibes = createQueryUnwrapper({
  hosts,
  path: '/subscribe.php',
  params: ['url'],
  ignoreLinkFragment: true,
})
