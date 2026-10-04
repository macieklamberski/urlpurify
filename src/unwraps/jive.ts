import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Jive community external link redirect (<community host>/external-link.jspa?url=<target>). Each
// community runs on its own host, so the exact path and an http `url` are the guard, not the host.
export const unwrapJive: UrlUnwrapper = (url) => {
  if (url.pathname !== '/external-link.jspa') {
    return
  }

  const target = url.searchParams.get('url')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
