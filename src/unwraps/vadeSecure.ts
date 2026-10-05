import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const safeproxyPathRegex = /^\/safeproxy\/v[34]$/

const extractAntiphishing = createParamExtractor({
  hosts: 'antiphishing.vadesecure.com',
  path: '/v4',
  params: ['u'],
})

const extractSafeproxy = createParamExtractor({
  hosts: ['m365.eu.vadesecure.com', 'm365.us.vadesecure.com', 'gws.eu.vadesecure.com'],
  params: ['u'],
})

// Vade Secure link rewriting (antiphishing.vadesecure.com/v4?u=<target>) and its Microsoft 365
// and Google Workspace proxy (m365.eu.vadesecure.com/safeproxy/v4?u=<target>, also /v3, on
// m365.us and gws.eu). The `f`, `i`, `k`, `r` and `s` params authenticate the wrapper.
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapVadeSecure: UrlUnwrapper = (url) => {
  if (safeproxyPathRegex.test(url.pathname)) {
    return extractSafeproxy(url)
  }

  return extractAntiphishing(url)
}
