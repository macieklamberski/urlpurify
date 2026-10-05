import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/redirects\/direct\/\d+\/\d+\/$/

const extractUrl = createParamExtractor({
  hosts: 'www.e-click.jp',
  params: ['url'],
})

// e-click affiliate redirect (www.e-click.jp/redirects/direct/<id>/<id>/?url=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapEClick: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractUrl(url)
}
