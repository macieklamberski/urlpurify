import { isHostOrSubdomainOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/L0\/(.+?)\/\d+\/[^/]+\/[^/]+$/

// Amazon SES click tracking (<id>.r.<region>.awstrack.me/L0/<target>/<n>/<message id>/<signature>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapAmazonSes: UrlUnwrapper = (url) => {
  if (!isHostOrSubdomainOf(url, 'awstrack.me')) {
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
