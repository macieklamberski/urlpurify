import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/redirects\/direct\/\d+\/\d+\/$/i

// e-click affiliate redirect (www.e-click.jp/redirects/direct/<id>/<id>/?url=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapEClick = createQueryUnwrapper({
  hosts: ['www.e-click.jp', 'e-click.jp'],
  path: pathRegex,
  params: ['url'],
})
