import { addArchivedScheme, resolvePathTarget } from '../pathTarget.js'
import { appendLinkFragment, createUnwrapper } from '../utils.js'

const pathRegex = /^\/(?:\d{14}|\d{4}\.\d{2}\.\d{2}-\d{6}|o\/[^/]+|newest)\/(?<target>.+)$/i
const escapedQueryRegex = /%3F/i
const selectionHashRegex = /^#selection-\d+\.\d+-\d+\.\d+$/i

// archive.today snapshot (archive.ph/<timestamp>/<URL>, archive.ph/o/<id>/<URL> and
// archive.ph/newest/<URL>, on every archive.today mirror domain).
// Opt-in: unwrapping returns the live page, not the copy.
export const unwrapArchiveToday = createUnwrapper({
  hosts: [
    'archive.is',
    'www.archive.is',
    'archive.ph',
    'www.archive.ph',
    'archive.today',
    'www.archive.today',
    'archive.md',
    'www.archive.md',
    'archive.fo',
    'www.archive.fo',
    'archive.vn',
    'www.archive.vn',
    'archive.li',
    'www.archive.li',
  ],
  ignoreLinkFragment: true, // archive.today's own `#selection-` highlight points into the snapshot
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.groups) {
      return
    }

    // A link can escape the target's own `?` and `#` as `%3F` and `%23` in the path.
    const target = resolvePathTarget(
      url,
      match.groups.target.replace(escapedQueryRegex, '?').replace('%23', '#'),
    )

    // An older /o/ link carries an http target with no scheme at all.
    const unwrapped = addArchivedScheme(target)

    return selectionHashRegex.test(url.hash) ? unwrapped : appendLinkFragment(url, unwrapped)
  },
})
