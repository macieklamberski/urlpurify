import { decodePercent, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { appendLinkFragment, createUnwrapper } from '../utils.js'

const domains = ['streaklinks.com', 'streak-link.com']

const pathRegex = /^\/[\w-]{24}\/([^/]+)$/

// Streak email click tracker (<id>.streak-link.com/<24 character id>/<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapStreak: UrlUnwrapper = createUnwrapper({
  domains,
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.[1]) {
      return
    }

    const target = decodePercent(match[1])

    if (isHttpUrl(target)) {
      return appendLinkFragment(target, url)
    }
  },
})
