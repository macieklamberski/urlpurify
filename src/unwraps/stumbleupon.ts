import { resolvePathTarget } from '../pathTarget.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const hosts = ['stumbleupon.com', 'www.stumbleupon.com']

// A 6-character url id, an optional token holding a colon, then the target with no scheme. The
// first segment of the target must be a host: a dot, no colon. A trailing `/r:t` is StumbleUpon's
// own marker, left off the framed target.
const pathRegex =
  /^\/su\/[a-z\d]{6}\/(?:[^/]*:[^/]*\/)?(?<target>[^/:]*\.[^/:]*(?:\/.*?)?)(?:\/r:t)?$/i

const extractRedirect = createQueryUnwrapper({
  hosts,
  path: '/to/event/redir/',
  params: ['url'],
})

// StumbleUpon toolbar page (www.stumbleupon.com/su/<id>[/<token>]/<target>), which framed the
// http target under StumbleUpon's toolbar, and its app promo redirect
// (www.stumbleupon.com/to/event/redir/?url=<target>), which answered 302 to the target. The
// service is gone and both paths answer 404.
export const unwrapStumbleupon = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const redirectTarget = extractRedirect(url)

    if (redirectTarget) {
      return redirectTarget
    }

    const match = pathRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    return resolvePathTarget(url, match.groups.target, 'http')
  },
})
