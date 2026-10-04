import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const redirectPathRegex = /^\/r\/?$/
const globalIdentityPathRegex = /^\/m\/global-identity(?:-2)?$/

// Authors and publications get their own `<name>.medium.com`, so the hosts match exactly.
const mediumHosts = ['medium.com', 'gen.medium.com']

const extractRedirectTarget = createParamExtractor({
  hosts: mediumHosts,
  params: ['url'],
})

const extractGlobalIdentityTarget = createParamExtractor({
  hosts: mediumHosts,
  params: ['redirectUrl'],
})

// Medium outbound redirect (/r/?url=<target>, also /r) and the sign-in hop to a custom-domain
// publication (/m/global-identity?redirectUrl=<target>, also -2), on medium.com and
// gen.medium.com only.
export const unwrapMedium: UrlUnwrapper = (url) => {
  if (redirectPathRegex.test(url.pathname)) {
    return extractRedirectTarget(url)
  }

  if (globalIdentityPathRegex.test(url.pathname)) {
    return extractGlobalIdentityTarget(url)
  }
}
