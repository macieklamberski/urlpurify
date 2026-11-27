import { getSubdomain, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

// turbopages.org answers 404 as of 2026-09-27, so only archived feeds carry its links.
const turbopagesPathRegex = /^\/[^/]+\/s\/(.+)$/i
const hostInPathRegex = /^\/turbo\/([^/]+)\/s\/(.+)$/i
const yandexSlashSFirstRegex = /^\/turbo\/s\/([^/]+)\/(.*)$/i
const turbopagesSlashSFirstRegex = /^\/s\/([^/]+)\/(.*)$/i
const dashRegex = /-/g
const yandexHostRegex = /^(?:www\.)?yandex\.(?:com\.tr|[a-z]{2,3})$/

const extractTurboTarget = createQueryUnwrapper({
  hosts: yandexHostRegex,
  path: '/turbo',
  params: ['text'],
})

// Yandex Turbo cached page (<source-host-with-dashes>.turbopages.org/<host>/s/<path>).
// The subdomain encodes the original host, replacing `.` with `-`; the path
// after `/s/` is the original path. Also the same page with the host in the path
// (yandex.<tld>/turbo/<host>/s/<path> and <dashed-host>.turbopages.org/turbo/<host>/s/<path>), with
// `/s/` before the host (yandex.<tld>/turbo/s/<host>/<path> and
// <dashed-host>.turbopages.org/s/<host>/<path>), and
// the Turbo view on Yandex (yandex.<tld>/turbo?text=<target>, also on www.yandex.<tld>).
// Not included in defaultUnwrappers: Turbo serves a stripped-down,
// optimized rendering of the source page rather than the canonical content.
// Opt in by passing a custom unwrappers array.
export const unwrapYandexTurbo: UrlUnwrapper = (url) => {
  const turboTarget = extractTurboTarget(url)

  if (turboTarget) {
    return turboTarget
  }

  const turbopagesSubdomain = getSubdomain(url, 'turbopages.org')
  const isTurbopagesHost = turbopagesSubdomain !== undefined

  if (!isTurbopagesHost && !isHostOf(url, yandexHostRegex)) {
    return
  }

  const slashSFirstRegex = isTurbopagesHost ? turbopagesSlashSFirstRegex : yandexSlashSFirstRegex
  const slashSFirstMatch = url.pathname.match(slashSFirstRegex)

  // The query on these links is Turbo's own, such as parent-reqid or trbsrc.
  if (slashSFirstMatch) {
    return `https://${slashSFirstMatch[1]}/${slashSFirstMatch[2]}${url.hash}`
  }

  const hostInPathMatch = url.pathname.match(hostInPathRegex)

  if (hostInPathMatch) {
    return `https://${hostInPathMatch[1]}/${hostInPathMatch[2]}${url.hash}`
  }

  if (!turbopagesSubdomain) {
    return
  }

  const match = url.pathname.match(turbopagesPathRegex)
  if (!match) {
    return
  }

  const sourceHost = turbopagesSubdomain.replace(dashRegex, '.')

  return `https://${sourceHost}/${match[1]}${url.hash}`
}
