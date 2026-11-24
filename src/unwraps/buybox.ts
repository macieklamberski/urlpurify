import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/linkclick_\d+_\d+$/i

const extractUrl = createQueryUnwrapper({
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
