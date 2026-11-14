import { createParamExtractor } from '../utils.js'

// AddToAny subscribe button (www.addtoany.com/subscribe?linkurl=<feed>, also ?url=<feed>).
// Opt-in in the subscribe intent group: the button opens AddToAny's page that lists readers for the
// feed, it never redirects to it.
export const unwrapAddToAnySubscribe = createParamExtractor({
  hosts: ['addtoany.com', 'www.addtoany.com'],
  path: '/subscribe',
  params: ['linkurl', 'url'],
})
