import { createQueryUnwrapper } from '../utils.js'

const pathRegex = /^\/\d+\/[bt]\/\d+$/

// Commission Factory affiliate click (t.cfjump.com/<publisher id>/t/<program id>?Url=<target>,
// also /b/ for a banner click). Not included in defaultUnwrappers: unwrapping drops the
// publisher's commission.
export const unwrapCommissionFactory = createQueryUnwrapper({
  hosts: ['t.cfjump.com'],
  path: pathRegex,
  params: ['Url'],
})
