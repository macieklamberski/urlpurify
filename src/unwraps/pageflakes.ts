import { createQueryUnwrapper } from '../utils.js'

// Pageflakes subscribe button (www.pageflakes.com/subscribe.aspx?url=<feed>), a dead service.
// Opt-in: the link added the feed to a Pageflakes page, not redirected to it.
export const unwrapPageflakes = createQueryUnwrapper({
  hosts: ['pageflakes.com', 'www.pageflakes.com'],
  path: '/subscribe.aspx',
  params: ['url'],
  ignoreLinkFragment: true,
})
