import { isAnyOf, isHttpUrl } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const paths = ['/dia/track.jsp', '/salsa/track.jsp']

// Salsa Classic email click tracker on any host (salsa3.salsalabs.com/dia/track.jsp?key=<id>&
// url=<target>, also /salsa/track.jsp on senders' own domains).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapSalsa = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, paths)) {
      return
    }

    const target = readParamTarget(url, 'url')

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  },
})
