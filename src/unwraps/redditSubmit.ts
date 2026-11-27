import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const submitPathRegex = /^\/submit\/?$/i

const hosts = [
  'www.reddit.com',
  'reddit.com',
  'en.reddit.com',
  'old.reddit.com',
  'np.reddit.com',
  'm.reddit.com',
]

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['url'],
  ignoreLinkFragment: true,
})

// Reddit share link (reddit.com/submit?url=<page>&title=<text>, also /submit/, on www., bare, en.,
// old., np. and m.reddit.com). Opt-in in the share intent group: unwrapping returns the shared
// page, not the form that posts it.
export const unwrapRedditSubmit = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!submitPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
