import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/redirects\/direct\/\d+\/\d+\/$/i

// e-click affiliate redirect (www.e-click.jp/redirects/direct/<id>/<id>/?url=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapEClick = createQueryUnwrapper({
  hosts: ['e-click.jp', 'www.e-click.jp'],
  path: pathRegex,
  params: ['url'],
})
