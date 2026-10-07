import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

// A 6-character url id, an optional token holding a colon, then the target with no scheme. The
// first segment of the target must be a host: a dot, no colon. A trailing `/r:t` is StumbleUpon's
// own marker, left off the framed target.
const pathRegex = /^\/su\/[a-z\d]{6}\/(?:[^/]*:[^/]*\/)?([^/:]*\.[^/:]*(?:\/.*?)?)(?:\/r:t)?$/i

const extractRedirect = createParamExtractor({
  hosts: 'www.stumbleupon.com',
  path: '/to/event/redir/',
  params: ['url'],
})

// StumbleUpon toolbar page (www.stumbleupon.com/su/<id>[/<token>]/<target>), which framed the
// http target under StumbleUpon's toolbar, and its app promo redirect
// (www.stumbleupon.com/to/event/redir/?url=<target>), which answered 302 to the target. The
// service is gone and both paths answer 404.
export const unwrapStumbleupon: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'www.stumbleupon.com')) {
    return
  }

  const redirectTarget = extractRedirect(url)

  if (redirectTarget) {
    return redirectTarget
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // An unencoded target's query and fragment land in the toolbar URL's own `search` and `hash`.
  return `http://${match[1]}${url.search}${url.hash}`
}
