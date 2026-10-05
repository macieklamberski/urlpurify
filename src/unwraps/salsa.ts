import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamValues } from '../utils.js'

const paths = ['/dia/track.jsp', '/salsa/track.jsp']

// Salsa Classic email click tracker (salsa3.salsalabs.com/dia/track.jsp?key=<id>&url=<target>,
// also on Salsa's other hosts and senders' own domains, and as /salsa/track.jsp). Senders run it
// on their own hosts, so the exact path and an http `url` are the guard, not the host. Salsa
// Classic is closed, and captures up to 2021 show it forwarding. Not included in
// defaultUnwrappers: unwrapping removes the sender's click count.
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
