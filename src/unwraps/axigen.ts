import { isAnyOf, isHttpUrl } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

// Axigen WebMail link redirect on an organization's own mail server (<mail
// host>/redir.hsp?url=<target>). Each organization runs it on its own host, so the exact path and
// an http `url` are the guard, not the host.
// Opt-in: the shim's page needs a sign-in, which unwrapping skips.
export const unwrapAxigen = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, '/redir.hsp')) {
      return
    }

    const target = readParamTarget(url, 'url')

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  },
})
