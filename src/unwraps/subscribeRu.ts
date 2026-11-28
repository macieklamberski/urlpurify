import { resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

// A newsletter's `<list>,<issue>/<timestamp>/<ids>/m<n>` or the bare `_`, then `/-/` and the
// target with no scheme. A target that keeps its scheme lands on a broken `http://https:/…`, so
// the first segment must be a host: a dot, no colon.
const pathRegex = /^\/(?:[^/]+,\d+\/\d{14}\/[^/]+\/m\d+|_)\/-\/(?<target>[^/:]*\.[^/:]*(?:\/.*)?)$/i

// Subscribe.ru newsletter click tracker (redirect.subscribe.ru/<list>,<issue>/<timestamp>/<ids>/
// m<n>/-/<target>, also redirect.subscribe.ru/_/-/<target>), which answers 302 to the target with
// `http://` added.
// Opt-in: unwrapping removes the sender's click count.
export const unwrapSubscribeRu = createUnwrapper({
  hosts: 'redirect.subscribe.ru',
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.groups?.target) {
      return
    }

    return resolvePathTarget(url, match.groups.target, 'http')
  },
})
