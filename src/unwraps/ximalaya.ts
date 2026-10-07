import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const filePathRegex = /^\/\/[^/]+$/
const targetHostRegex = /\.xmcdn\.com$/

const extractTarget = createParamExtractor({
  hosts: 'jt.ximalaya.com',
  params: ['jt'],
})

// Ximalaya download measurement prefix (jt.ximalaya.com//<file>?album_id=<id>&jt=<target>).
// Not included in defaultUnwrappers: unwrapping removes the podcaster's download counts.
export const unwrapXimalaya: UrlUnwrapper = (url) => {
  if (!filePathRegex.test(url.pathname)) {
    return
  }

  const target = extractTarget(url)

  if (!target) {
    return
  }

  // The prefix forwards only to Ximalaya's own audio hosts and answers 200 with no redirect for
  // any other target.
  try {
    if (targetHostRegex.test(new URL(target).hostname)) {
      return target
    }
  } catch {}
}
