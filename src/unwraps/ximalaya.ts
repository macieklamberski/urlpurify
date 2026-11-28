import { parseUrl } from 'trousse'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const filePathRegex = /^\/\/[^/]+$/
const targetHostRegex = /\.xmcdn\.com$/

const hosts = 'jt.ximalaya.com'

const extractTarget = createQueryUnwrapper({
  hosts,
  params: ['jt'],
})

// Ximalaya download measurement prefix (jt.ximalaya.com//<file>?album_id=<id>&jt=<target>).
// Opt-in: unwrapping removes the podcaster's download counts.
export const unwrapXimalaya = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!filePathRegex.test(url.pathname)) {
      return
    }

    const target = extractTarget(url)

    if (!target) {
      return
    }

    // The prefix forwards only to Ximalaya's own audio hosts and answers 200 with no redirect for
    // any other target.
    const targetHost = parseUrl(target)?.hostname

    if (targetHost && targetHostRegex.test(targetHost)) {
      return target
    }
  },
})
