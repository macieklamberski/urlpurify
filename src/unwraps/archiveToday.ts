import { decodeSegment, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const hostRegex = /^(?:www\.)?archive\.(?:is|ph|today|md|fo|vn|li)$/
const pathRegex = /^\/(?:\d{14}|\d{4}\.\d{2}\.\d{2}-\d{6}|o\/[^/]+|newest)\/(.+)$/
const encodedSchemeRegex = /^https?%3A/i
const collapsedSchemeRegex = /^(https?):\/(?!\/)/i
const schemeRegex = /^[a-z][a-z\d+.-]*:/i
const escapedQueryRegex = /%3F/i
const selectionHashRegex = /^#selection-\d+\.\d+-\d+\.\d+$/

// archive.today snapshot (archive.ph/<timestamp>/<URL>, archive.ph/o/<id>/<URL> and
// archive.ph/newest/<URL>, on every archive.today mirror domain).
// Not included in defaultUnwrappers: a snapshot is a page at a point in time, and unwrapping
// returns the live page, which may have changed or gone.
export const unwrapArchiveToday: UrlUnwrapper = (url) => {
  if (!hostRegex.test(url.hostname)) {
    return
  }

  const match = url.pathname.match(pathRegex)

  if (!match) {
    return
  }

  let target: string | undefined = match[1]

  if (encodedSchemeRegex.test(target)) {
    target = decodeSegment(target)
  }

  if (!target) {
    return
  }

  // A target arrives with the scheme's double slash collapsed to one, and an older /o/ link
  // carries an http target with no scheme at all.
  target = target.replace(collapsedSchemeRegex, '$1://')

  if (!schemeRegex.test(target)) {
    target = `http://${target}`
  }

  // A link can escape the target's own `?` and `#` as `%3F` and `%23` in the path.
  target = target.replace(escapedQueryRegex, '?').replace('%23', '#')

  // An unencoded target's query and fragment land in the snapshot URL's own `search` and `hash`,
  // except archive.today's own `#selection-` highlight, which points into the snapshot.
  const hash = selectionHashRegex.test(url.hash) ? '' : url.hash
  const unwrapped = `${target}${url.search}${hash}`

  if (!isHttpUrl(unwrapped)) {
    return
  }

  return unwrapped
}
