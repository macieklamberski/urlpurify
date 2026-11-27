import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const pathRegex = /^\/redirects\/direct\/\d+\/\d+\/$/i

const hosts = ['www.e-click.jp']

const extractUrl = createQueryUnwrapper({
  hosts,
  params: ['url'],
})

// e-click affiliate redirect (www.e-click.jp/redirects/direct/<id>/<id>/?url=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapEClick = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return extractUrl(url)
  },
})
