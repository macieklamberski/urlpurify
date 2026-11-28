import { createQueryUnwrapper } from '../utils.js'

// Pageflakes subscribe button (www.pageflakes.com/subscribe.aspx?url=<feed>), a dead service.
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapPageflakes = createQueryUnwrapper({
  hosts: ['pageflakes.com', 'www.pageflakes.com'],
  path: '/subscribe.aspx',
  params: ['url'],
  ignoreLinkFragment: true,
})
