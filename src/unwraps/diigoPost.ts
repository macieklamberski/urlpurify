import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// Diigo bookmark button (www.diigo.com/post?url=<target>&title=&desc=, also on diigo.com and
// secure.diigo.com). The `title=` and `desc=` beside it are free text. Opt-in: unwrapping returns
// the bookmarked page, not the form that saves it.
export const unwrapDiigoPost: UrlUnwrapper = createParamExtractor({
  hosts: ['www.diigo.com', 'diigo.com', 'secure.diigo.com'],
  path: '/post',
  params: ['url'],
  ignoreLinkFragment: true,
})
