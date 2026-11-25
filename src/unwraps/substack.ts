import { decodeBase64Url, isHostOf, isHttpUrl, isString, parseJson } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const redirectPathRegex = /^\/redirect\/2\/([A-Za-z0-9_-]+)\.[A-Za-z0-9_-]+$/i

// Substack email click redirect (substack.com/redirect/2/<base64url JSON>.<signature>), the
// target in the JSON's e field. Opt-in: unwrapping removes the sender's click count.
export const unwrapSubstack: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'substack.com')) {
    return
  }

  const payload = url.pathname.match(redirectPathRegex)?.[1]

  if (!payload) {
    return
  }

  const target = parseJson<{ e?: unknown }>(decodeBase64Url(payload))?.e

  if (isString(target) && isHttpUrl(target)) {
    return target
  }
}
