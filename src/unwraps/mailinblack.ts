import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, decodeBase64Url } from '../utils.js'

const extractKey = createParamExtractor({
  hosts: /^mibc-fr-\d+\.mailinblack\.com$/,
  path: '/securelink/',
  params: ['key'],
})

// Mailinblack link protection (mibc-fr-<n>.mailinblack.com/securelink/?url=<origin>&key=<blob>).
// The `url` param holds only the target's origin. The full target is the `url` field of `key`,
// a base64url JSON object that also holds the language and a token.
// Not included in defaultUnwrappers: the gateway checks the target when the link is clicked,
// so unwrapping skips the check the recipient's organization put in place.
export const unwrapMailinblack: UrlUnwrapper = (url) => {
  const key = extractKey(url)

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
