import { createQueryUnwrapper } from '../utils.js'

// Hacker News submit link (news.ycombinator.com/submitlink?u=<target>&t=<title>). The `t=` beside
// it is the story title.
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapHackerNewsSubmit = createQueryUnwrapper({
  hosts: 'news.ycombinator.com',
  path: '/submitlink',
  params: ['u'],
  ignoreLinkFragment: true,
})
