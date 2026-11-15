import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const hosts = ['netvibes.com', 'www.netvibes.com']

// Netvibes subscribe button (www.netvibes.com/subscribe.php?url=<feed>, also on netvibes.com). Not
// in defaultUnwrappers: the link added the feed to a Netvibes dashboard, it never redirected to it.
export const unwrapNetvibes: UrlUnwrapper = createParamExtractor({
  hosts,
  path: '/subscribe.php',
  params: ['url'],
})
