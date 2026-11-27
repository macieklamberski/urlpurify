import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const redirectPathRegex = /^\/rd\/\d+$/i

const hosts = ['rd.hirkereso.hu']

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['url'],
})

// Hírkereső news aggregator click redirect (rd.hirkereso.hu/rd/<id>?partner=rss&url=<target>).
export const unwrapHirkereso = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!redirectPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
