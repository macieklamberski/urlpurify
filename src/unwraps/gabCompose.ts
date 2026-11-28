import { createQueryUnwrapper } from '../utils.js'

// Gab share form (gab.com/compose?url=<page>, on the bare and www. hosts).
// Opt-in: unwrapping returns the shared page, not the form that shares it. The `text=` beside it is
// the post's message, even when it holds only a url.
export const unwrapGabCompose = createQueryUnwrapper({
  hosts: ['gab.com', 'www.gab.com'],
  path: '/compose',
  params: ['url'],
  ignoreLinkFragment: true,
})
