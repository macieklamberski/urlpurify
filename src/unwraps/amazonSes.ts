import { isHostOrSubdomainOf, isHttpUrl } from 'trousse'
import { decodePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { appendLinkFragment } from '../utils.js'

const awstrackPathRegex = /^\/L0\/(.+?)\/\d+\/[^/]+\/[^/]+$/i
const customPathRegex = /^\/CL0\/(.+?)\/\d+\/[^/]+-000000\/[^/]+$/i

// Amazon SES click tracking (<id>.r.<region>.awstrack.me/L0/<target>/<n>/<message id>/<signature>)
// and a sender's own host (/CL0/<target>/<n>/<message id>-000000/<signature>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapAmazonSes: UrlUnwrapper = (url) => {
  const isAwstrack = isHostOrSubdomainOf(url, 'awstrack.me')
  const pathRegex = isAwstrack ? awstrackPathRegex : customPathRegex
  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  const target = decodePathTarget(match[1])

  // On a sender's own host, only an http target tells the tracker from another site's /CL0/ path.
  if (!isAwstrack && !isHttpUrl(target)) {
    return
  }

  return appendLinkFragment(target, url)
}
