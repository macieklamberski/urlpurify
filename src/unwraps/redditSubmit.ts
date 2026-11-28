import { createQueryUnwrapper } from '../utils.js'

const submitPathRegex = /^\/submit\/?$/i

// Reddit share link (reddit.com/submit?url=<page>&title=<text>, also /submit/, on www., bare, en.,
// old., np. and m.reddit.com).
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapRedditSubmit = createQueryUnwrapper({
  hosts: [
    'reddit.com',
    'www.reddit.com',
    'en.reddit.com',
    'old.reddit.com',
    'np.reddit.com',
    'm.reddit.com',
  ],
  path: submitPathRegex,
  params: ['url'],
  ignoreLinkFragment: true,
})
