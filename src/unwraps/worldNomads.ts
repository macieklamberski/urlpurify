import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const affiliatePaths = ['/Turnstile/AffiliateLink', '/af.aspx']

const extractPath = createParamExtractor({
  hosts: 'www.worldnomads.com',
  params: ['path'],
})

// World Nomads affiliate link (www.worldnomads.com/Turnstile/AffiliateLink?partnerCode=<id>&path=
// <target>, also /af.aspx?affiliate=<id>&path=<target>). Not included in defaultUnwrappers:
// unwrapping drops the publisher's commission.
export const unwrapWorldNomads: UrlUnwrapper = (url) => {
  if (!affiliatePaths.includes(url.pathname)) {
    return
  }

  return extractPath(url)
}
