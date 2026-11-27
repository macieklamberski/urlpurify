import { isHttpUrl } from 'trousse'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const hosts = ['live.com', 'www.live.com']

const extractAdd = createQueryUnwrapper({
  hosts,
  path: '/',
  params: ['add'],
  ignoreLinkFragment: true,
})

// Windows Live subscribe button (www.live.com/?add=<feed>, also on live.com). Opt-in in the
// subscribe intent group: the link added the feed to a Windows Live start page, it never
// redirected to it.
export const unwrapWindowsLive = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const target = extractAdd(url)

    // The carrier sits on the site's root, where add= may hold something other than a url.
    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
