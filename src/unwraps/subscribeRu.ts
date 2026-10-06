import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// A newsletter's `<list>,<issue>/<timestamp>/<ids>/m<n>` or the bare `_`, then `/-/` and the
// target with no scheme. A target that keeps its scheme lands on a broken `http://https/…`, so
// the first segment must be a host: a dot, no colon.
const pathRegex = /^\/(?:[^/]+,\d+\/\d{14}\/[^/]+\/m\d+|_)\/-\/([^/:]*\.[^/:]*(?:\/.*)?)$/

// Subscribe.ru newsletter click tracker (redirect.subscribe.ru/<list>,<issue>/<timestamp>/<ids>/
// m<n>/-/<target>, also redirect.subscribe.ru/_/-/<target>), which answers 302 to the target with
// `http://` added. Opt-in: unwrapping removes the sender's click count.
export const unwrapSubscribeRu: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'redirect.subscribe.ru')) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // An unencoded target's query and fragment land in the tracker URL's own `search` and `hash`.
  return `http://${match[1]}${url.search}${url.hash}`
}
