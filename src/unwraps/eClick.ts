import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/redirects\/direct\/\d+\/\d+\/$/i

const extractUrl = createQueryUnwrapper({
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
