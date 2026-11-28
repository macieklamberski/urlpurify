import { decodePercent, isHostOf } from 'trousse'
import { addArchivedScheme, decodePathTarget, isEncodedPathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const hosts = [
  'web.archive.org',
  'wayback.archive.org',
  'web-beta.archive.org',
  'web-wp.archive.org',
  'web-old.archive.org',
  'classic-web.archive.org',
  'archive.org',
  'www.archive.org',
  'waybackmachine.org',
  'www.waybackmachine.org',
  'webcf.waybackmachine.org',
]

const replayHosts = ['web.archive.org', 'replay.web.archive.org', 'replay.waybackmachine.org']

// A 14-digit timestamp, then the wildcard or a replay modifier, such as `id_` for the original
// bytes or `im_`, `js_` and `cs_` for an archived image, script or stylesheet.
const snapshot = String.raw`\d{14}(?:\*|(?:id|if|mp|fw|oe|im|js|cs)_)?`
// An Archive-It collection id, an organization id or `all`.
const collection = String.raw`(?:\d+|org-\d+|all)`

// With no timestamp, the target follows `/web/` directly and Wayback serves its latest snapshot.
const pathRegex = new RegExp(`^/web/(?:${snapshot}/)?(?<target>.+)$`, 'i')
const replayPathRegex = new RegExp(`^/${snapshot}/(?<target>.+)$`, 'i')
const archiveItPathRegex = new RegExp(`^/${collection}/${snapshot}/(?<target>.+)$`, 'i')
const scholarPathRegex = /^\/work\/[a-z0-9]+\/access\/wayback\/(?<target>.+)$/i
// A dot in the first segment tells a host from Wayback's own paths, such as `/web/diff/`, except
// its own pages `/web/form-submit.jsp` and `archive.org/web/web.php`, and a relative image
// snapshot such as `/web/<timestamp>im_/photo.jpg`.
const schemelessRegex = /^(?![^/]*\.(?:jsp|php|jpg)(?:\/|$))[^/]*\./i

// Web Archive snapshot wrapper (web.archive.org/web/<timestamp>[<modifier>]/<URL>), also served
// from wayback, web-beta, web-wp, web-old and classic-web.archive.org, from archive.org itself and
// from the old www and webcf.waybackmachine.org domain, the latest snapshot
// (web.archive.org/web/<URL>), the replay path (replay.web.archive.org/<timestamp>/<URL>, also on
// web.archive.org and replay.waybackmachine.org), Archive-It collections
// (wayback.archive-it.org/<collection or all>/<timestamp>[<modifier>]/<URL>), and the Scholar
// access link (scholar.archive.org/work/<id>/access/wayback/<URL>), which redirects to a Wayback
// snapshot. Each may carry an http target with no scheme, as in `/web/<timestamp>/example.com/`.
// Opt-in: an archive URL is a historical snapshot at a specific point in time, not a redirect;
// unwrapping returns the live page, which may have changed or 404'd. Opt in by passing a custom
// unwrappers array.
export const unwrapWebArchive = createUnwrapper({
  hosts: [...hosts, ...replayHosts, 'wayback.archive-it.org', 'scholar.archive.org'],
  unwrap: (url) => {
    let match: RegExpMatchArray | null = null

    if (isHostOf(url, hosts)) {
      match = pathRegex.exec(url.pathname)
    }

    if (!match && isHostOf(url, replayHosts)) {
      match = replayPathRegex.exec(url.pathname)
    }

    if (isHostOf(url, 'wayback.archive-it.org')) {
      match = archiveItPathRegex.exec(url.pathname)
    }

    if (isHostOf(url, 'scholar.archive.org')) {
      match = scholarPathRegex.exec(url.pathname)
    }

    if (!match?.groups) {
      return
    }

    // Wayback decodes a raw target's escapes, such as `%23` before its fragment. An encoded target
    // holds its own query, so the snapshot url's is Wayback's.
    const isEncoded = isEncodedPathTarget(match.groups.target)
    const path = isEncoded
      ? decodePathTarget(match.groups.target)
      : decodePercent(match.groups.target)
    const target = isEncoded ? path : `${path}${url.search}`

    // Wayback answers a target with no scheme with its http snapshot.
    if (schemelessRegex.test(path)) {
      return addArchivedScheme(target)
    }

    return target
  },
})
