import { decodeBase64Url } from 'trousse'
import { createQueryUnwrapper } from '../utils.js'

// Sophos Email time-of-click protection (<region>.protection.sophos.com/?d=<domain>&u=<base64url>),
// on regional hosts such as eu-central-1 and us-west-2. The `d` param holds only the target domain.
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapSophos = createQueryUnwrapper({
  hosts: /^(?:us|eu|ca)-[a-z]+-\d\.protection\.sophos\.com$/,
  path: '/',
  params: ['u'],
  decode: decodeBase64Url,
})
