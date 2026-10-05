import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/in\/offer\/\d+$/

const extractTarget = createParamExtractor({
  hosts: 'rdr.salesdoubler.com.ua',
  params: ['dlink'],
})

// SalesDoubler affiliate click (rdr.salesdoubler.com.ua/in/offer/<offer
// id>?aid=<id>&dlink=<target>). Not included in defaultUnwrappers: unwrapping drops the publisher's
// commission.
export const unwrapSalesdoubler: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
