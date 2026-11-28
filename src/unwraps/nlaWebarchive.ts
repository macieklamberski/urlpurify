import { isHostOf } from 'trousse'
import { addArchivedScheme, resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const hosts = ['webarchive.nla.gov.au', 'web.archive.org.au']

// A collection, then a 14-digit timestamp with an optional replay modifier.
const pathRegex = /^\/(?:awa|gov|wayback)\/\d{14}(?:mp_)?\/(?<target>.+)$/i
// Pandora answers 404 on the archive's collections and serves its old replay path only.
const pandoraPathRegex = /^\/nph-wb\/\d{14}\/(?<target>.+)$/i
// A title id, then the harvest date with an optional time, then the target with no scheme. The
// dot in its first segment marks a host.
const pandoraTitlePathRegex = /^\/pan\/\d+\/\d{8}(?:-\d{4})?\/(?<target>[^/]*\..*)$/i

// National Library of Australia web archive snapshot (webarchive.nla.gov.au/awa/<timestamp>/
// <target>, also /gov/ and /wayback/, web.archive.org.au/awa/<timestamp>[mp_]/<target>, and
// pandora.nla.gov.au/nph-wb/<timestamp>/<target>), and Pandora title snapshots
// (pandora.nla.gov.au/pan/<id>/<YYYYMMDD>[-HHMM]/<target>).
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapNlaWebarchive = createUnwrapper({
  hosts: [...hosts, 'pandora.nla.gov.au'],
  unwrap: (url) => {
    let match: RegExpExecArray | null = null

    if (isHostOf(url, hosts)) {
      match = pathRegex.exec(url.pathname)
    }

    if (isHostOf(url, 'pandora.nla.gov.au')) {
      match = pandoraPathRegex.exec(url.pathname)

      if (!match?.groups) {
        match = pandoraTitlePathRegex.exec(url.pathname)
      }
    }

    if (!match?.groups?.target) {
      return
    }

    return addArchivedScheme(resolvePathTarget(url, match.groups.target))
  },
})
