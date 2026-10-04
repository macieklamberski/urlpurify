import { isHostOrSubdomainOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const domains = ['streaklinks.com', 'streak-link.com']
const pathRegex = /^\/[\w-]{24}\/([^/]+)$/

// Streak email click tracker (<id>.streak-link.com/<24 character id>/<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapStreak: UrlUnwrapper = (url) => {
  if (!isHostOrSubdomainOf(url, domains)) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  try {
    const target = decodeURIComponent(match[1])

    if (isHttpUrl(target)) {
      return target
    }
  } catch {}
}
