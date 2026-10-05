import { decodeSegment, isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const hosts = [
  'web.archive.org',
  'wayback.archive.org',
  'web-beta.archive.org',
  'web-wp.archive.org',
  'web-old.archive.org',
  'classic-web.archive.org',
  'archive.org',
  'www.waybackmachine.org',
  'webcf.waybackmachine.org',
]

const replayHosts = ['web.archive.org', 'replay.web.archive.org', 'replay.waybackmachine.org']

// A 14-digit timestamp, then the wildcard or a replay modifier, such as `id_` for the original
// bytes or `im_`, `js_` and `cs_` for an archived image, script or stylesheet.
const snapshot = String.raw`\d{14}(?:\*|(?:id|if|mp|fw|oe|im|js|cs)_)?`
// With no timestamp, the target follows `/web/` directly and Wayback serves its latest snapshot.
const pathRegex = new RegExp(`^/web/(?:${snapshot}/)?(.+)$`)
const replayPathRegex = new RegExp(`^/${snapshot}/(.+)$`)
const archiveItPathRegex = new RegExp(String.raw`^/(?:\d+|org-\d+|all)/${snapshot}/(.+)$`)
const scholarPathRegex = /^\/work\/[a-z0-9]+\/access\/wayback\/(.+)$/

// Web Archive snapshot wrapper (web.archive.org/web/<timestamp>[<modifier>]/<URL>), also served
// from wayback, web-beta, web-wp, web-old and classic-web.archive.org, from archive.org itself and
// from the old www and webcf.waybackmachine.org domain, the latest snapshot
// (web.archive.org/web/<URL>), the replay path (replay.web.archive.org/<timestamp>/<URL>, also on
// web.archive.org and replay.waybackmachine.org), Archive-It collections
// (wayback.archive-it.org/<collection or all>/<timestamp>[<modifier>]/<URL>), and the Scholar
// access link (scholar.archive.org/work/<id>/access/wayback/<URL>), which redirects to a Wayback
// snapshot.
// Not included in defaultUnwrappers: an archive URL is a historical
// snapshot at a specific point in time, not a redirect; unwrapping returns
// the live page, which may have changed or 404'd. Opt in by passing a custom
// unwrappers array.
export const unwrapWebArchive: UrlUnwrapper = (url) => {
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

  const target = decodeSegment(match[1])

  if (!target || !isHttpUrl(target)) {
    return
  }

  // An unencoded target's query and fragment land in the snapshot URL's own `search` and `hash`.
  return `${target}${url.search}${url.hash}`
}
