import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const extractRedirectTarget = createParamExtractor({
  domains: ['a8.net', 'moba8.net'],
  path: '/svt/ejp',
  params: ['a8ejpredirect'],
})

const extractDeeplinkTarget = createParamExtractor({
  domains: 'a8.net',
  params: ['url'],
})

const deeplinkPathRegex = /^\/s\d+\/redirect_v2\.php$/

// A8.net affiliate redirect (/svt/ejp?a8ejpredirect=<target> on a8.net and moba8.net) and deep link
// (/s<id>/redirect_v2.php?url=<target> on a8.net), each on the domain and every subdomain.
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapA8Net: UrlUnwrapper = (url) => {
  if (deeplinkPathRegex.test(url.pathname)) {
    return extractDeeplinkTarget(url)
  }

  return extractRedirectTarget(url)
}
