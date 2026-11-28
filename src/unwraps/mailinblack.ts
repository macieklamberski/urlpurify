import { decodeBase64Url, isAnyOf, isHttpUrl, isString, parseJson } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readDecodedTarget } from '../utils.js'

const decodeKey = (key: string): string | undefined => {
  const target = parseJson<{ url?: unknown }>(decodeBase64Url(key))?.url

  if (isString(target)) {
    return target
  }
}

// Mailinblack Secure Link (mibc-fr-<n>.mailinblack.com/securelink/?url=<origin>&key=<blob>).
// Partners serve the same link from their own hosts, such as mib.numerian.fr and antispam.xefi.fr,
// so the exact path matches on any host, guarded by a `key` that decodes to JSON with an http url.
// The `url` param holds only the target's origin. The full target is the `url` field of `key`,
// a base64url JSON object that also holds the language and a token.
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapMailinblack: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/securelink/')) {
      return
    }

    const target = readDecodedTarget(url, 'key', decodeKey)

    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
