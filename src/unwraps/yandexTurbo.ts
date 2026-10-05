import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const turbopagesHostRegex = /\.turbopages\.org$/
// Some links put `/turbo/` before the host, `/turbo/<host>/s/<path>`, and are not matched.
// turbopages.org answers 404 for both shapes as of 2026-09-27, so only archived feeds carry them.
const turbopagesPathRegex = /^\/[^/]+\/s\/(.+)$/
const dashRegex = /-/g
const yandexHostRegex = /^(?:www\.)?yandex\.(?:com\.tr|[a-z]{2,3})$/

const extractTurboTarget = createParamExtractor({
  hosts: yandexHostRegex,
  path: '/turbo',
  params: ['text'],
})

// Yandex Turbo cached page (<source-host-with-dashes>.turbopages.org/<host>/s/<path>).
// The subdomain encodes the original host, replacing `.` with `-`; the path
// after `/s/` is the original path. Also the Turbo view on Yandex
// (yandex.<tld>/turbo?text=<target>, also on www.yandex.<tld>).
// Not included in defaultUnwrappers: Turbo serves a stripped-down,
// optimized rendering of the source page rather than the canonical content.
// Opt in by passing a custom unwrappers array.
export const unwrapYandexTurbo: UrlUnwrapper = (url) => {
  const turboTarget = extractTurboTarget(url)

  if (turboTarget) {
    return turboTarget
  }

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
