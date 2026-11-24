import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { readParamTarget } from '../utils.js'

const hosts = ['www.threads.com', 'threads.com', 'www.threads.net', 'threads.net']

const pathRegex = /^\/intent\/post\/?$/i

// Threads share intent (threads.com/intent/post?url=<target>, also /intent/post/, on www. and bare
// threads.com and threads.net). Opt-in: unwrapping returns the shared page, not the post composer.
export const unwrapThreadsIntent: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, pathRegex)) {
    return
  }

  // The `text=` beside it is the post's message, even when it holds only a url.
  return readParamTarget(url, 'url')
}
