import { createQueryUnwrapper } from '../utils.js'

// Anytime Player subscribe button (anytimeplayer.app/subscribe?url=<feed>, also /subscribe.html).
// Opt-in: unwrapping returns the show's feed, not the page that opens it in the app.
export const unwrapAnytimePlayer = createQueryUnwrapper({
  hosts: ['anytimeplayer.app', 'www.anytimeplayer.app'],
  path: ['/subscribe', '/subscribe.html'],
  params: ['url'],
  ignoreLinkFragment: true,
})
