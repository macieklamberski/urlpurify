import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// The snapshot is a 14-digit timestamp with an optional replay modifier, or `+` for the latest.
const pathRegex = /^(?:\/ukgwa)?\/(?:\d{14}(?:mp_)?|\+)\/(.+)$/i
// This check takes no dot in the scheme, so `www.example.gov.uk:80/` reads as a host with a port.
const schemeRegex = /^[a-z][a-z\d+-]*:/i

// UK Government Web Archive snapshot (webarchive.nationalarchives.gov.uk/[ukgwa/]<timestamp>[mp_]/
// <target>, or `+` for the latest), with or without the target's scheme. Opt-in: unwrapping
// returns the live page, which may have changed or be gone.
export const unwrapUkgwa: UrlUnwrapper = createUnwrapper({
  hosts: 'webarchive.nationalarchives.gov.uk',
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.[1]) {
      return
    }

    // An unencoded target's query lands in the snapshot URL's own `search`.
    let target = `${match[1]}${url.search}`

    // The archive's replay page names a target stored with no scheme as an http url.
    if (!schemeRegex.test(match[1])) {
      target = `http://${target}`
    }

    if (isHttpUrl(target)) {
      return target
    }
  },
})
