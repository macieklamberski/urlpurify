import { isHostOrSubdomainOf, isHttpUrl } from 'trousse'
import { decodePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const awstrackPathRegex = /^\/L0\/(?<target>.+?)\/\d+\/[^/]+\/[^/]+$/i
const customPathRegex = /^\/CL0\/(?<target>.+?)\/\d+\/[^/]+-000000\/[^/]+$/i

// Amazon SES click tracking (<id>.r.<region>.awstrack.me/L0/<target>/<n>/<message id>/<signature>)
// and a sender's own host (/CL0/<target>/<n>/<message id>-000000/<signature>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapAmazonSes = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    const isAwstrack = isHostOrSubdomainOf(url, 'awstrack.me')
    const pathRegex = isAwstrack ? awstrackPathRegex : customPathRegex
    const match = pathRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    const target = decodePathTarget(match.groups.target)

    // On a sender's own host, only an http target tells the tracker from another site's /CL0/ path.
    if (!isAwstrack && !isHttpUrl(target)) {
      return
    }

    return target
  },
})
