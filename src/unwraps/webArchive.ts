import { decodePercent, isHostOf } from 'trousse'
import { decodePathTarget, isEncodedPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'
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
  'www.waybackmachine.org',
  'waybackmachine.org',
  'webcf.waybackmachine.org',
]

const replayHosts = ['web.archive.org', 'replay.web.archive.org', 'replay.waybackmachine.org']

// A 14-digit timestamp, then the wildcard or a replay modifier, such as `id_` for the original
// bytes or `im_`, `js_` and `cs_` for an archived image, script or stylesheet.
const snapshot = String.raw`\d{14}(?:\*|(?:id|if|mp|fw|oe|im|js|cs)_)?`

// With no timestamp, the target follows `/web/` directly and Wayback serves its latest snapshot.
const pathRegex = new RegExp(`^/web/(?:${snapshot}/)?(.+)$`, 'i')
const replayPathRegex = new RegExp(`^/${snapshot}/(.+)$`, 'i')
const archiveItPathRegex = new RegExp(String.raw`^/(?:\d+|org-\d+|all)/${snapshot}/(.+)$`, 'i')
const scholarPathRegex = /^\/work\/[a-z0-9]+\/access\/wayback\/(.+)$/i
// A scheme has no dot, so `www.example.com:80/` reads as a host with a port.
const schemeRegex = /^[a-z][a-z\d+-]*:/i
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
// Not included in defaultUnwrappers: an archive URL is a historical
// snapshot at a specific point in time, not a redirect; unwrapping returns
// the live page, which may have changed or 404'd. Opt in by passing a custom
// unwrappers array.
export const unwrapWebArchive: UrlUnwrapper = createUnwrapper({
  hosts: [...hosts, ...replayHosts, 'wayback.archive-it.org', 'scholar.archive.org'],
  unwrap: (url) => {
    let match: RegExpMatchArray | null = null

    if (isHostOf(url, hosts)) {
      match = url.pathname.match(pathRegex)
    }

    if (!match && isHostOf(url, replayHosts)) {
      match = url.pathname.match(replayPathRegex)
    }

    if (isHostOf(url, 'wayback.archive-it.org')) {
      match = url.pathname.match(archiveItPathRegex)
    }

    if (isHostOf(url, 'scholar.archive.org')) {
      match = url.pathname.match(scholarPathRegex)
    }

    if (!match) {
      return
    }

    // Wayback decodes a raw target's escapes, such as `%23` before its fragment. An encoded target
    // holds its own query, so the snapshot url's is Wayback's.
    const isEncoded = isEncodedPathTarget(match[1])
    const path = isEncoded ? decodePathTarget(match[1]) : decodePercent(match[1])
    const target = isEncoded ? path : `${path}${url.search}`

    // Wayback answers a target with no scheme with its http snapshot.
    if (!schemeRegex.test(path) && schemelessRegex.test(path)) {
      return `http://${target}`
    }

    return target
  },
})
