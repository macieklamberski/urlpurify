import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, decodeBase64Url } from '../utils.js'

const extractEncoded = createParamExtractor({
  hosts: /^(?:us|eu|ca)-[a-z]+-\d\.protection\.sophos\.com$/,
  path: '/',
  params: ['u'],
})

// Sophos Email time-of-click protection (<region>.protection.sophos.com/?d=<domain>&u=<base64url>),
// on regional hosts such as eu-central-1 and us-west-2. The `d` param holds only the target domain.
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapSophos: UrlUnwrapper = (url) => {
  const encoded = extractEncoded(url)

  if (!encoded) {
    return
  }

  const decoded = decodeBase64Url(encoded)

  if (decoded && isHttpUrl(decoded)) {
    return decoded
  }
}
