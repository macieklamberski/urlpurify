import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/linkclick_\d+_\d+$/i

// Buybox affiliate click (go.buybox.click/linkclick_<id>_<id>?url=<target>).
// Opt-in: unwrapping drops the publisher's commission.
export const unwrapBuybox = createQueryUnwrapper({
  hosts: ['go.buybox.click'],
  path: pathRegex,
  params: ['url'],
})
