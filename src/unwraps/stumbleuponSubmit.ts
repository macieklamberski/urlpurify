import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['stumbleupon.com', 'www.stumbleupon.com', 'badge.stumbleupon.com']

const pathRegex = /^\/(?:submit(?:\.php)?|refer\.php|badge\/?)$/i

// StumbleUpon share (stumbleupon.com/submit?url=<target>, /submit.php, /refer.php, /badge and
// /badge/, on www., bare and badge.stumbleupon.com), which redirects to Mix's share form with the
// same url=.
// Opt-in: unwrapping returns the shared page, not the form.
export const unwrapStumbleuponSubmit = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return readParamTarget(url, 'url')
  },
})
