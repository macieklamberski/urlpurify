import { isAnyOf, isHttpUrl } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const handlerPaths = ['/email_handler.aspx', '/api/email/handler']

// Vuture email click tracker on any host
// (<sender host>/email_handler.aspx?sid=<id>&redirect=<target>, also /api/email/handler).
// Opt-in: unwrapping removes the sender's click count. Law firms run it on their own hosts.
export const unwrapVuture = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, handlerPaths)) {
      return
    }

    const target = readParamTarget(url, 'redirect')

    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
