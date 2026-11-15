import { createParamExtractor } from '../utils.js'

// Threads share intent (threads.com/intent/post?url=<target>, on www. and bare threads.com and
// threads.net). Opt-in: unwrapping returns the shared page, not the post composer.
// The `text=` beside it is the post's message, even when it holds only a url.
export const unwrapThreadsIntent = createParamExtractor({
  hosts: ['www.threads.com', 'threads.com', 'www.threads.net', 'threads.net'],
  path: '/intent/post',
  params: ['url'],
})
