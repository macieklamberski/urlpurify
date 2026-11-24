import { createQueryUnwrapper } from '../utils.js'

// Gab share form (gab.com/compose?url=<page>, on the bare and www. hosts). Opt-in in the share
// intent group: the link opens Gab's post composer with the page attached, it never redirects to
// it. The `text=` beside it is the post's message, even when it holds only a url.
export const unwrapGabCompose = createQueryUnwrapper({
  hosts: ['gab.com', 'www.gab.com'],
  path: '/compose',
  params: ['url'],
  ignoreLinkFragment: true,
})
