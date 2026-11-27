import { decodeBase64Url } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, getBase64Target } from '../utils.js'

const hostRegex = /^(?:us|eu|ca)-[a-z]+-\d\.protection\.sophos\.com$/

// Sophos Email time-of-click protection (<region>.protection.sophos.com/?d=<domain>&u=<base64url>),
// on regional hosts such as eu-central-1 and us-west-2. The `d` param holds only the target domain.
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapSophos: UrlUnwrapper = createUnwrapper({
  hosts: hostRegex,
  unwrap: (url) => {
    if (url.pathname !== '/') {
      return
    }

    return getBase64Target(url, 'u', decodeBase64Url)
  },
})
