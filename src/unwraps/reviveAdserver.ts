import { decodePercent, hasQueryParam, isHttpUrl } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

// The delivery directory varies per install, such as /www/delivery/ or /openx/www/delivery/.
// ck.php is the click script, cl.php the signed one.
const clickPathRegex = /^(?:\/[^/]+)*\/c[kl]\.php$/i
const legacyClickPathRegex = /^(?:\/[^/]+)*\/adclick\.php$/i

const destinationMarker = 'oadest='
const fallbackMarker = 'dest='

// Revive Adserver ad click on any host (<host>/www/delivery/ck.php?oaparams=...__oadest=<target>)
// and the phpAdsNew click (<host>/adclick.php?bannerid=<id>&dest=<target>). Sites self-host it.
// Opt-in: unwrapping removes the click attribution.
export const unwrapReviveAdserver = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (clickPathRegex.test(url.pathname)) {
      // The server reads everything after `oadest=` in the raw query as the target, or after the
      // first `dest=`, such as OpenX 2's `maxdest=`. The target keeps its own unencoded `&` params.
      let marker = destinationMarker
      let index = url.search.indexOf(marker)

      if (index === -1) {
        marker = fallbackMarker
        index = url.search.indexOf(marker)
      }

      if (index === -1) {
        return
      }

      const target = decodePercent(url.search.slice(index + marker.length))

      if (isHttpUrl(target)) {
        return target
      }

      return
    }

    if (!legacyClickPathRegex.test(url.pathname) || !hasQueryParam(url, 'bannerid')) {
      return
    }

    const target = readParamTarget(url, 'dest')

    if (!target || !isHttpUrl(target)) {
      return
    }

    return target
  },
})
