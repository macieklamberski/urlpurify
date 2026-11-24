import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const extractAdd = createQueryUnwrapper({
  hosts: ['live.com', 'www.live.com'],
  path: '/',
  params: ['add'],
  ignoreLinkFragment: true,
})

// Windows Live subscribe button (www.live.com/?add=<feed>, also on live.com). Opt-in in the
// subscribe intent group: the link added the feed to a Windows Live start page, it never
// redirected to it.
export const unwrapWindowsLive: UrlUnwrapper = (url) => {
  const target = extractAdd(url)

  // The carrier sits on the site's root, where add= may hold something other than a url.
  if (target && isHttpUrl(target)) {
    return target
  }
}
