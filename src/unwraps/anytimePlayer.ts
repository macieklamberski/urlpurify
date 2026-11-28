import { createQueryUnwrapper } from '../utils.js'

// Anytime Player subscribe button (anytimeplayer.app/subscribe?url=<feed>, also /subscribe.html).
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapAnytimePlayer = createQueryUnwrapper({
  hosts: ['anytimeplayer.app', 'www.anytimeplayer.app'],
  path: ['/subscribe', '/subscribe.html'],
  params: ['url'],
  ignoreLinkFragment: true,
})
