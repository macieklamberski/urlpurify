import { isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const paths = ['/dia/track.jsp', '/salsa/track.jsp']

// Salsa Classic email click tracker on any host (salsa3.salsalabs.com/dia/track.jsp?key=<id>&
// url=<target>, also /salsa/track.jsp on senders' own domains). Opt-in: unwrapping removes the
// sender's click count.
export const unwrapSalsa: UrlUnwrapper = (url) => {
  if (!isAnyOf(url.pathname, paths)) {
    return
  }

  const target = getParamTarget(url, 'url')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
