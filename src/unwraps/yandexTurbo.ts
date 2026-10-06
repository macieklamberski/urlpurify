import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const turbopagesHostRegex = /\.turbopages\.org$/
// turbopages.org answers 404 as of 2026-09-27, so only archived feeds carry its links.
const turbopagesPathRegex = /^\/[^/]+\/s\/(.+)$/
const hostInPathRegex = /^\/turbo\/([^/]+)\/s\/(.+)$/
const dashRegex = /-/g
const yandexHostRegex = /^(?:www\.)?yandex\.(?:com\.tr|[a-z]{2,3})$/

const extractTurboTarget = createParamExtractor({
  hosts: yandexHostRegex,
  path: '/turbo',
  params: ['text'],
})

// Yandex Turbo cached page (<source-host-with-dashes>.turbopages.org/<host>/s/<path>).
// The subdomain encodes the original host, replacing `.` with `-`; the path
// after `/s/` is the original path. Also the same page with the host in the path
// (yandex.<tld>/turbo/<host>/s/<path> and <dashed-host>.turbopages.org/turbo/<host>/s/<path>), and
// the Turbo view on Yandex (yandex.<tld>/turbo?text=<target>, also on www.yandex.<tld>).
// Not included in defaultUnwrappers: Turbo serves a stripped-down,
// optimized rendering of the source page rather than the canonical content.
// Opt in by passing a custom unwrappers array.
export const unwrapYandexTurbo: UrlUnwrapper = (url) => {
  const turboTarget = extractTurboTarget(url)

  if (turboTarget) {
    return turboTarget
  }

  const isTurbopagesHost = turbopagesHostRegex.test(url.hostname)

  if (!isTurbopagesHost && !yandexHostRegex.test(url.hostname)) {
    return
  }

  const hostInPathMatch = url.pathname.match(hostInPathRegex)

  // The query on these links is Turbo's own, such as parent-reqid or trbsrc.
  if (hostInPathMatch) {
    return `https://${hostInPathMatch[1]}/${hostInPathMatch[2]}`
  }

  if (!isTurbopagesHost) {
    return
  }

  const match = url.pathname.match(turbopagesPathRegex)
  if (!match) {
    return
  }

  const sourceHost = url.hostname.replace(turbopagesHostRegex, '').replace(dashRegex, '.')

  return `https://${sourceHost}/${match[1]}`
}
