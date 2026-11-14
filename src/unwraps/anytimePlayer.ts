import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// Anytime Player subscribe button (anytimeplayer.app/subscribe?url=<feed>). Opt-in: unwrapping
// returns the show's feed, not the page that opens it in the app.
export const unwrapAnytimePlayer: UrlUnwrapper = createParamExtractor({
  hosts: 'anytimeplayer.app',
  path: '/subscribe',
  params: ['url'],
})
