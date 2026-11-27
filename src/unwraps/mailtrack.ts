import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const trackPathRegex = /^\/(?:(?:(?:trace\/)?link|l)\/[^/]+)?$/i

const hosts = ['mailtrack.io']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['url'],
})

// Mailtrack email click tracker (mailtrack.io/{trace/link,link,l}/<id>?url=<target>, also
// mailtrack.io/?url=<target>).
export const unwrapMailtrack = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!trackPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
