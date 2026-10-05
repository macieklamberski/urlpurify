import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// The delivery directory varies per install, such as /www/delivery/ or /openx/www/delivery/.
const clickPathRegex = /^(?:\/[^/]+)*\/ck\.php$/
const legacyClickPathRegex = /^(?:\/[^/]+)*\/adclick\.php$/
const destinationMarker = 'oadest='

// Revive Adserver and OpenX ad click on any host
// (<host>/www/delivery/ck.php?oaparams=2__bannerid=<id>__zoneid=<id>__oadest=<target>), and the
// older phpAdsNew click (<host>/adclick.php?bannerid=<id>&zoneid=<id>&dest=<target>).
// Opt-in: unwrapping removes the click count the advertiser pays for. Sites self-host the server.
export const unwrapReviveAdserver: UrlUnwrapper = (url) => {
  if (clickPathRegex.test(url.pathname)) {
    // The server reads everything after `oadest=` in the raw query as the target, so the target
    // keeps its own unencoded `&` params, wherever `oadest=` sits.
    const index = url.search.indexOf(destinationMarker)

    if (index === -1) {
      return
    }

    try {
      const target = decodeURIComponent(url.search.slice(index + destinationMarker.length))

      if (isHttpUrl(target)) {
        return target
      }
    } catch {}

    return
  }

  if (!legacyClickPathRegex.test(url.pathname) || !url.searchParams.has('bannerid')) {
    return
  }

  const target = url.searchParams.get('dest')

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
