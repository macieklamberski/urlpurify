import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget, percentDecode } from '../utils.js'

const encodedSchemeRegex = /^https?%3A/i
const handlerPaths = ['/email_handler.aspx', '/api/email/handler']

// Vuture email click tracker on any host
// (<sender host>/email_handler.aspx?sid=<id>&redirect=<target>, also /api/email/handler).
// Opt-in: unwrapping removes the sender's click count. Law firms run it on their own hosts.
export const unwrapVuture: UrlUnwrapper = (url) => {
  if (!handlerPaths.includes(url.pathname)) {
    return
  }

  let target = getParamTarget(url, 'redirect')

  // A target encoded twice still holds an encoded scheme after one decode.
  if (target && encodedSchemeRegex.test(target)) {
    target = percentDecode(target)
  }

  if (target && isHttpUrl(target)) {
    return target
  }
}
