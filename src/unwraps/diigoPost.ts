import { createQueryUnwrapper } from '../utils.js'

// Diigo bookmark button (www.diigo.com/post?url=<target>&title=&desc=, also on diigo.com and
// secure.diigo.com). The `title=` and `desc=` beside it are free text.
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapDiigoPost = createQueryUnwrapper({
  hosts: ['diigo.com', 'www.diigo.com', 'secure.diigo.com'],
  path: '/post',
  params: ['url'],
  ignoreLinkFragment: true,
})
