import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const redirectPathRegex = /^\/r\/?$/
const globalIdentityPathRegex = /^\/m\/global-identity(?:-2)?$/

const extractRedirectTarget = createParamExtractor({
  hosts: 'medium.com',
  params: ['url'],
})

const extractGlobalIdentityTarget = createParamExtractor({
  hosts: 'medium.com',
  params: ['redirectUrl'],
})

// Medium outbound link redirect (medium.com/r/?url=<target>, also /r?url=<target>), and the
// cross-domain sign-in hop to a custom-domain publication
// (medium.com/m/global-identity?redirectUrl=<target>, also /m/global-identity-2).
export const unwrapMedium: UrlUnwrapper = (url) => {
  if (redirectPathRegex.test(url.pathname)) {
    return extractRedirectTarget(url)
  }

  if (globalIdentityPathRegex.test(url.pathname)) {
    return extractGlobalIdentityTarget(url)
  }
}
