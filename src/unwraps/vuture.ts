import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const encodedSchemeRegex = /^https?%3A/i

// Vuture email click tracker on any host
// (<sender host>/email_handler.aspx?sid=<id>&redirect=<target>).
// Opt-in: unwrapping removes the sender's click count. Law firms run it on their own hosts.
export const unwrapVuture: UrlUnwrapper = (url) => {
  if (url.pathname !== '/email_handler.aspx') {
    return
  }

  let target = url.searchParams.get('redirect')

  // A target encoded twice still holds an encoded scheme after one decode.
  if (target && encodedSchemeRegex.test(target)) {
    try {
      target = decodeURIComponent(target)
    } catch {}
  }

  if (target && isHttpUrl(target)) {
    return target
  }
}
