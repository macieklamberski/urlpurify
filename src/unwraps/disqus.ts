import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const paths = ['/', '/url']
// A colon and 27 base64url characters, an unpadded 20-byte digest.
const signatureRegex = /:[\w-]{27}$/

const extractTarget = createParamExtractor({
  hosts: 'disq.us',
  params: ['url'],
})

// Disqus outbound link redirect (disq.us/url?url=<target>:<signature> and
// disq.us/?url=<target>).
export const unwrapDisqus: UrlUnwrapper = (url) => {
  if (!paths.includes(url.pathname)) {
    return
  }

  const target = extractTarget(url)

  // A root-form target is unsigned and can itself end in a colon and 27 characters.
  if (url.pathname !== '/url') {
    return target
  }

  // Disqus redirects to the target with its signature cut off.
  return target?.replace(signatureRegex, '')
}
