import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// The click-through counter at the blog root or under one blog folder.
const pathRegex = /^(?:\/[^/]+)?\/ct\.ashx$/

// dasBlog click-through counter, on each blog's own host (<host>/[<blog>/]ct.ashx?id=<guid>&
// url=<target>).
export const unwrapDasBlog: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  const target = url.searchParams.get('url')

  if (target && isHttpUrl(target)) {
    return target
  }
}
