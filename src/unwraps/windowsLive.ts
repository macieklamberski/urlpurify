import { createQueryUnwrapper } from '../utils.js'

// Windows Live subscribe button (www.live.com/?add=<feed>, also on live.com).
// Opt-in: the link added the feed to a Windows Live start page, it never redirected to it.
export const unwrapWindowsLive = createQueryUnwrapper({
  hosts: ['live.com', 'www.live.com'],
  path: '/',
  params: ['add'],
  ignoreLinkFragment: true,
})
