import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamValues } from '../utils.js'

const paths = ['/dia/track.jsp', '/salsa/track.jsp']

// Salsa Classic email click tracker on any host (salsa3.salsalabs.com/dia/track.jsp?key=<id>&
// url=<target>, also /salsa/track.jsp on senders' own domains). Opt-in: unwrapping removes the
// sender's click count.
export const unwrapSalsa: UrlUnwrapper = (url) => {
  if (!paths.includes(url.pathname)) {
    return
  }

  const target = getParamValues(url, 'url').at(0)

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
