import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const paths = ['/', '/url']

// A colon and 27 base64url characters, an unpadded 20-byte digest.
const signatureRegex = /:[\w-]{27}$/

// Disqus outbound link redirect (disq.us/url?url=<target>:<signature> and
// disq.us/?url=<target>).
export const unwrapDisqus: UrlUnwrapper = createUnwrapper({
  hosts: ['disq.us', 'www.disq.us'],
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, paths)) {
      return
    }

    const target = readParamTarget(url, 'url')

    if (!target) {
      return
    }

    // A root-form target is unsigned and can itself end in a colon and 27 characters.
    if (!isAnyOf(url.pathname, '/url')) {
      return target
    }

    // Disqus redirects to the target with its signature cut off.
    return target.replace(signatureRegex, '')
  },
})
