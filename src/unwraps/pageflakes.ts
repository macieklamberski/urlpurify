import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

// Pageflakes subscribe button (www.pageflakes.com/subscribe.aspx?url=<feed>), a dead service.
// Not in defaultUnwrappers: the link added the feed to a Pageflakes page, not redirected to it.
export const unwrapPageflakes: UrlUnwrapper = createQueryUnwrapper({
  hosts: ['pageflakes.com', 'www.pageflakes.com'],
  path: '/subscribe.aspx',
  params: ['url'],
  ignoreLinkFragment: true,
})
