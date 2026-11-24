import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const hosts = ['anytimeplayer.app', 'www.anytimeplayer.app']

const extractSubscribe = createParamExtractor({
  hosts,
  path: '/subscribe',
  params: ['url'],
  ignoreLinkFragment: true,
})

const extractSubscribeHtml = createParamExtractor({
  hosts,
  path: '/subscribe.html',
  params: ['url'],
  ignoreLinkFragment: true,
})

// Anytime Player subscribe button (anytimeplayer.app/subscribe?url=<feed>, also /subscribe.html).
// Opt-in: unwrapping returns the show's feed, not the page that opens it in the app.
export const unwrapAnytimePlayer: UrlUnwrapper = (url) => {
  return extractSubscribe(url) ?? extractSubscribeHtml(url)
}
