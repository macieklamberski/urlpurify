import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const extractRedirectTarget = createParamExtractor({
  hosts: ['px.a8.net', 'rpx.a8.net', 'www.a8.net', 'px.moba8.net'],
  path: '/svt/ejp',
  params: ['a8ejpredirect'],
})

const extractDeeplinkTarget = createParamExtractor({
  hosts: 'ow.a8.net',
  params: ['url'],
})

const deeplinkPathRegex = /^\/s\d+\/redirect_v2\.php$/

// A8.net affiliate redirect (px.a8.net, rpx.a8.net, www.a8.net and px.moba8.net,
// /svt/ejp?a8ejpredirect=<target>) and deep link (ow.a8.net/s<id>/redirect_v2.php?url=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's affiliate commission.
export const unwrapA8Net: UrlUnwrapper = (url) => {
  let target = extractRedirectTarget(url)

  if (!target && deeplinkPathRegex.test(url.pathname)) {
    target = extractDeeplinkTarget(url)
  }

  // A target percent-encoded in EUC-JP or Shift_JIS decodes to U+FFFD, so it stays wrapped.
  if (target && !target.includes('�')) {
    return target
  }
}
