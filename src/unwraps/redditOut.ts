import { createQueryUnwrapper } from '../utils.js'

const outPathRegex = /^\/(?:t\d_[a-z0-9]+)?$/i

// Reddit outbound click tracker (out.reddit.com/t3_<id>?url=<target>, also out.reddit.com/?url=).
export const unwrapRedditOut = createQueryUnwrapper({
  hosts: 'out.reddit.com',
  path: outPathRegex,
  params: ['url'],
})
