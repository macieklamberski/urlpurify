import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

// Axigen WebMail link redirect on an organization's own mail server
// (<mail host>/redir.hsp?url=<target>). Each organization runs it on its own host, so the exact
// path and an http `url` are the guard, not the host. Opt-in, like the other webmail link shims.
export const unwrapAxigen: UrlUnwrapper = (url) => {
  if (url.pathname !== '/redir.hsp') {
    return
  }

  const target = getParamTarget(url, 'url')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
