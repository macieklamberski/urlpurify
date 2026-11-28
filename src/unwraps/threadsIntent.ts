import { isAnyOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['threads.com', 'www.threads.com', 'threads.net', 'www.threads.net']

const pathRegex = /^\/intent\/post\/?$/i

// Threads share intent (threads.com/intent/post?url=<target>, also /intent/post/, on www. and bare
// threads.com and threads.net).
// Opt-in: unwrapping returns the shared page, not the post composer.
export const unwrapThreadsIntent = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, pathRegex)) {
      return
    }

    // The `text=` beside it is the post's message, even when it holds only a url.
    return readParamTarget(url, 'url')
  },
})
