import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const redirectPathRegex = /^\/rd\/\d+$/

const extractTarget = createParamExtractor({
  hosts: 'rd.hirkereso.hu',
  params: ['url'],
})

// Hírkereső news aggregator click redirect (rd.hirkereso.hu/rd/<id>?partner=rss&url=<target>).
export const unwrapHirkereso: UrlUnwrapper = (url) => {
  if (!redirectPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
