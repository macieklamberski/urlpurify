import { isHostOrSubdomainOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const awstrackPathRegex = /^\/L0\/(.+?)\/\d+\/[^/]+\/[^/]+$/
const customPathRegex = /^\/CL0\/(.+?)\/\d+\/[^/]+-000000\/[^/]+$/

// Amazon SES click tracking (<id>.r.<region>.awstrack.me/L0/<target>/<n>/<message id>/<signature>)
// and a sender's own host (/CL0/<target>/<n>/<message id>-000000/<signature>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapAmazonSes: UrlUnwrapper = (url) => {
  const pathRegex = isHostOrSubdomainOf(url, 'awstrack.me') ? awstrackPathRegex : customPathRegex
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
