import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64Url } from '../utils.js'

// Mailinblack Secure Link (mibc-fr-<n>.mailinblack.com/securelink/?url=<origin>&key=<blob>).
// Partners serve the same link from their own hosts, such as mib.numerian.fr and antispam.xefi.fr,
// so the exact path matches on any host, guarded by a `key` that decodes to JSON with an http url.
// The `url` param holds only the target's origin. The full target is the `url` field of `key`,
// a base64url JSON object that also holds the language and a token.
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapMailinblack: UrlUnwrapper = (url) => {
  if (url.pathname !== '/securelink/') {
    return
  }

  const key = url.searchParams.get('key')

  if (!key) {
    return
  }

  const json = decodeBase64Url(key)

  if (!json) {
    return
  }

  try {
    const target = JSON.parse(json)?.url

    if (typeof target === 'string' && isHttpUrl(target)) {
      return target
    }
  } catch {}
}
