import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// A collection, then a 14-digit timestamp with an optional replay modifier.
const pathRegex = /^\/(?:awa|gov|wayback)\/\d{14}(?:mp_)?\/(.+)$/
// Pandora answers 404 on the archive's collections and serves its old replay path only.
const pandoraPathRegex = /^\/nph-wb\/\d{14}\/(.+)$/
// A title id, then the harvest date with an optional time, then the target with no scheme. The
// dot in its first segment marks a host.
const pandoraTitlePathRegex = /^\/pan\/\d+\/\d{8}(?:-\d{4})?\/([^/]*\..*)$/

// National Library of Australia web archive snapshot (webarchive.nla.gov.au/awa/<timestamp>/
// <target>, also /gov/ and /wayback/, web.archive.org.au/awa/<timestamp>[mp_]/<target>, and
// pandora.nla.gov.au/nph-wb/<timestamp>/<target>), and Pandora title snapshots
// (pandora.nla.gov.au/pan/<id>/<YYYYMMDD>[-HHMM]/<target>). Not included in defaultUnwrappers:
// unwrapping returns the live page, which may have changed or be gone.
export const unwrapNlaWebarchive: UrlUnwrapper = (url) => {
  let match: RegExpExecArray | null = null
  let scheme = ''

  if (isHostOf(url, ['webarchive.nla.gov.au', 'web.archive.org.au'])) {
    match = pathRegex.exec(url.pathname)
  }

  if (isHostOf(url, 'pandora.nla.gov.au')) {
    match = pandoraPathRegex.exec(url.pathname)

    if (!match) {
      match = pandoraTitlePathRegex.exec(url.pathname)
      // Pandora's title page links the publisher's site as http beside its snapshot.
      scheme = 'http://'
    }
  }

  if (!match?.[1]) {
    return
  }

  // An unencoded target's query and fragment land in the snapshot URL's own `search` and `hash`.
  const target = `${scheme}${match[1]}${url.search}${url.hash}`

  if (isHttpUrl(target)) {
    return target
  }
}
