import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const clickPathRegex = /^\/h\/(?:i\/[A-Za-z0-9]+\/)?[A-Za-z0-9]+$/i

const hosts = ['s.bl-1.com', 's2.bl-1.com', 'microsoft.bl-1.com']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['url'],
})

// Bananatag email click tracker (s.bl-1.com/h/<id>?url=<target>, also /h/i/<id>/<id>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapBananatag = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!clickPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
