import { resolvePathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
import { appendLinkFragment, createUnwrapper } from '../utils.js'

const hostRegex = /^(?:www\.)?archive\.(?:is|ph|today|md|fo|vn|li)$/
const pathRegex = /^\/(?:\d{14}|\d{4}\.\d{2}\.\d{2}-\d{6}|o\/[^/]+|newest)\/(.+)$/i
// A scheme has no dot, so `www.example.com:80/` reads as a host with a port.
const schemeRegex = /^[a-z][a-z\d+-]*:/i
const escapedQueryRegex = /%3F/i
const selectionHashRegex = /^#selection-\d+\.\d+-\d+\.\d+$/i

// archive.today snapshot (archive.ph/<timestamp>/<URL>, archive.ph/o/<id>/<URL> and
// archive.ph/newest/<URL>, on every archive.today mirror domain).
// Not included in defaultUnwrappers: a snapshot is a page at a point in time, and unwrapping
// returns the live page, which may have changed or gone.
export const unwrapArchiveToday: UrlUnwrapper = createUnwrapper({
  hosts: hostRegex,
  ignoreLinkFragment: true, // archive.today's own `#selection-` highlight points into the snapshot
  unwrap: (url) => {
    const match = url.pathname.match(pathRegex)

    if (!match) {
      return
    }

    // A link can escape the target's own `?` and `#` as `%3F` and `%23` in the path.
    const target = resolvePathTarget(
      url,
      match[1].replace(escapedQueryRegex, '?').replace('%23', '#'),
    )

    // An older /o/ link carries an http target with no scheme at all.
    const unwrapped = schemeRegex.test(target) ? target : `http://${target}`

    return selectionHashRegex.test(url.hash) ? unwrapped : appendLinkFragment(unwrapped, url)
  },
})
