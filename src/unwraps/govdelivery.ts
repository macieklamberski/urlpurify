import { isHostOrSubdomainOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const pathRegex = /^\/CL0\/([^/]+)\/\d+\/[^/]+\/[^/]+$/

// GovDelivery email click tracker
// (links-1.govdelivery.com/CL0/<target>/<n>/<message id>/<signature>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapGovdelivery: UrlUnwrapper = (url) => {
  if (!isHostOrSubdomainOf(url, 'govdelivery.com')) {
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
