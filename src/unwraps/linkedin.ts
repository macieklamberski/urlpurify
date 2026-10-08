import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const shimPathRegex =
  /^\/(safety\/go|redir\/redirect)\/?$|^\/(redirect|nhome\/nus-redirect|nus-trk|e\/v2)$|^\/company\/[^/]+\/redirect$/

// LinkedIn outbound link shims and click trackers, all with ?url=<target> on www.linkedin.com:
// /safety/go, /redir/redirect (both also with a trailing slash), /redirect, /nhome/nus-redirect,
// /nus-trk, /e/v2 and /company/<id>/redirect.
export const unwrapLinkedin: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'www.linkedin.com') || !shimPathRegex.test(url.pathname)) {
    return
  }

  const target = getParamTarget(url, 'url')

  if (!target) {
    return
  }

  return target
}
