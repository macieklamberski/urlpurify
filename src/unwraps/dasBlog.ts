import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

// The click-through counter at the blog root or under one blog folder.
const pathRegex = /^(?:\/[^/]+)?\/ct\.ashx$/i

// dasBlog click-through counter, on each blog's own host (<host>/[<blog>/]ct.ashx?id=<guid>&
// url=<target>).
export const unwrapDasBlog: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    // A nested unencoded counter repeats `url`, and the first value is the inner counter cut short.
    const target = readParamTarget(url, 'url', { index: -1 })

    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
