import { decodeBase64Url, isString, parseJson } from 'trousse'
import { createUnwrapper } from '../utils.js'

const redirectPathRegex = /^\/redirect\/2\/(?<payload>[A-Za-z0-9_-]+)\.[A-Za-z0-9_-]+$/i

// Substack email click redirect (substack.com/redirect/2/<base64url JSON>.<signature>), the target
// in the JSON's e field.
// Opt-in: unwrapping removes the sender's click count.
export const unwrapSubstack = createUnwrapper({
  hosts: ['substack.com', 'www.substack.com'],
  unwrap: (url) => {
    const payload = redirectPathRegex.exec(url.pathname)?.groups?.payload

    if (!payload) {
      return
    }

    const target = parseJson<{ e?: unknown }>(decodeBase64Url(payload))?.e

    if (isString(target)) {
      return target
    }
  },
})
