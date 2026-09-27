import type { UrlUnwrapper } from '../types.js'

const turbopagesHostRegex = /\.turbopages\.org$/
const turbopagesPathRegex = /^\/[^/]+\/s\/(.+)$/
const dashRegex = /-/g

// Yandex Turbo cached page (<source-host-with-dashes>.turbopages.org/<host>/s/<path>).
// The subdomain encodes the original host, replacing `.` with `-`; the path
// after `/s/` is the original path.
// Not included in defaultUnwrappers: Turbo serves a stripped-down,
// optimized rendering of the source page rather than the canonical content.
// Opt in by passing a custom unwrappers array.
export const unwrapYandexTurbo: UrlUnwrapper = (url) => {
  if (!turbopagesHostRegex.test(url.hostname)) {
    return
  }

  const match = url.pathname.match(turbopagesPathRegex)
  if (!match) {
    return
  }

  const sourceHost = url.hostname.replace(turbopagesHostRegex, '').replace(dashRegex, '.')

  return `https://${sourceHost}/${match[1]}`
}
