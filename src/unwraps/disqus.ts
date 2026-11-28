import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readDecodedTarget, readParamTarget } from '../utils.js'

const paths = ['/', '/url']

// A colon and 27 base64url characters, an unpadded 20-byte digest.
const signatureRegex = /:[\w-]{27}$/

// Disqus redirects to the target with its signature cut off.
const stripSignature = (value: string): string => {
  return value.replace(signatureRegex, '')
}

// Disqus outbound link redirect (disq.us/url?url=<target>:<signature> and
// disq.us/?url=<target>).
export const unwrapDisqus: UrlUnwrapper = createUnwrapper({
  hosts: ['disq.us', 'www.disq.us'],
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, paths)) {
      return
    }

    // A root-form target is unsigned and can itself end in a colon and 27 characters.
    if (!isAnyOf(url.pathname, '/url')) {
      return readParamTarget(url, 'url')
    }

    const target = readParamTarget(url, 'url')

    if (target) {
      return stripSignature(target)
    }

    // A target with no path, as in `http://example.com:<signature>`, reads as a bad port until the
    // signature is cut off.
    return readDecodedTarget(url, 'url', stripSignature)
  },
})
