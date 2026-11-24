import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { readParamTarget } from '../utils.js'

const hosts = ['www.stumbleupon.com', 'stumbleupon.com', 'badge.stumbleupon.com']

const pathRegex = /^\/(?:submit(?:\.php)?|refer\.php|badge\/?)$/i

// StumbleUpon share (stumbleupon.com/submit?url=<target>, /submit.php, /refer.php, /badge and
// /badge/, on www., bare and badge.stumbleupon.com), which redirects to Mix's share form with the
// same url=. Opt-in: unwrapping returns the shared page, not the form.
export const unwrapStumbleuponSubmit: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !pathRegex.test(url.pathname)) {
    return
  }

  return readParamTarget(url, 'url')
}
