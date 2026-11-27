import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/in\/offer\/\d+$/i

// SalesDoubler affiliate click (rdr.salesdoubler.com.ua/in/offer/<offer
// id>?aid=<id>&dlink=<target>). Not included in defaultUnwrappers: unwrapping drops the publisher's
// commission.
export const unwrapSalesdoubler = createQueryUnwrapper({
  hosts: ['rdr.salesdoubler.com.ua'],
  path: pathRegex,
  params: ['dlink'],
})
