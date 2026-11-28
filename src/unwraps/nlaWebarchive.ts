import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

const hosts = ['webarchive.nla.gov.au', 'web.archive.org.au']

// A collection, then a 14-digit timestamp with an optional replay modifier.
const pathRegex = /^\/(?:awa|gov|wayback)\/\d{14}(?:mp_)?\/(.+)$/i
// Pandora answers 404 on the archive's collections and serves its old replay path only.
const pandoraPathRegex = /^\/nph-wb\/\d{14}\/(.+)$/i
// A title id, then the harvest date with an optional time, then the target with no scheme. The
// dot in its first segment marks a host.
const pandoraTitlePathRegex = /^\/pan\/\d+\/\d{8}(?:-\d{4})?\/([^/]*\..*)$/i

// National Library of Australia web archive snapshot (webarchive.nla.gov.au/awa/<timestamp>/
// <target>, also /gov/ and /wayback/, web.archive.org.au/awa/<timestamp>[mp_]/<target>, and
// pandora.nla.gov.au/nph-wb/<timestamp>/<target>), and Pandora title snapshots
// (pandora.nla.gov.au/pan/<id>/<YYYYMMDD>[-HHMM]/<target>). Not included in defaultUnwrappers:
// unwrapping returns the live page, which may have changed or be gone.
export const unwrapNlaWebarchive: UrlUnwrapper = createUnwrapper({
  hosts: [...hosts, 'pandora.nla.gov.au'],
  unwrap: (url) => {
    let match: RegExpExecArray | null = null
    let scheme = ''

    if (isHostOf(url, hosts)) {
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

    // An unencoded target's query lands in the snapshot URL's own `search`.
    return `${scheme}${match[1]}${url.search}`
  },
})
