import { decodePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const pathRegex = /^\/[\w-]{24}\/(?<target>[^/]+)$/

// Streak email click tracker (<id>.streak-link.com/<24 character id>/<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapStreak = createUnwrapper({
  domains: ['streaklinks.com', 'streak-link.com'],
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    return decodePathTarget(match.groups.target)
  },
})
