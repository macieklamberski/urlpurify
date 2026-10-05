import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/linkclick_\d+_\d+$/

const extractUrl = createParamExtractor({
  hosts: 'go.buybox.click',
  params: ['url'],
})

// Buybox affiliate click (go.buybox.click/linkclick_<id>_<id>?url=<target>).
// Not included in defaultUnwrappers: unwrapping drops the publisher's commission.
export const unwrapBuybox: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractUrl(url)
}
