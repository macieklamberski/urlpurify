import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

// Hacker News submit link (news.ycombinator.com/submitlink?u=<target>&t=<title>). The `t=` beside
// it is the story title. Opt-in: unwrapping returns the shared page, not the submit form.
export const unwrapHackerNewsSubmit: UrlUnwrapper = createQueryUnwrapper({
  hosts: 'news.ycombinator.com',
  path: '/submitlink',
  params: ['u'],
  ignoreLinkFragment: true,
})
