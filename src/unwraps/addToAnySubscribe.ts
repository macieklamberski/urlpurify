import { createQueryUnwrapper } from '../utils.js'

// AddToAny subscribe button (www.addtoany.com/subscribe?linkurl=<feed>, also ?url=<feed>).
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapAddToAnySubscribe = createQueryUnwrapper({
  hosts: ['addtoany.com', 'www.addtoany.com'],
  path: '/subscribe',
  params: ['linkurl', 'url'],
  ignoreLinkFragment: true,
})
