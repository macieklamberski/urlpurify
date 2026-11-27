import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const hosts = ['anytimeplayer.app', 'www.anytimeplayer.app']

const extractSubscribe = createQueryUnwrapper({
  hosts,
  path: '/subscribe',
  params: ['url'],
  ignoreLinkFragment: true,
})

const extractSubscribeHtml = createQueryUnwrapper({
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
