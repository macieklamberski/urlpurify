import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/world\/[a-z]+\/web(?:\/body)?\/?$/

const extractTarget = createParamExtractor({
  hosts: ['www.excite.co.jp', 'excite.co.jp', 'www.excite-webtl.jp'],
  params: ['wb_url'],
})

// Excite web page translation (www.excite.co.jp/world/<language>/web/[body/]?wb_url=<target>,
// also on excite.co.jp and www.excite-webtl.jp). Not included in defaultUnwrappers: a translation
// proxy shows the page translated, and unwrapping returns the original.
export const unwrapExciteTranslate: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
