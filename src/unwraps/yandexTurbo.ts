import { getSubdomain } from 'trousse'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

// turbopages.org answers 404 as of 2026-09-27, so only archived feeds carry its links.
const turbopagesPathRegex = /^\/[^/]+\/s\/(?<path>.+)$/i
const hostInPathRegex = /^\/turbo\/(?<host>[^/]+)\/s\/(?<path>.+)$/i
const yandexSlashSFirstRegex = /^\/turbo\/s\/(?<host>[^/]+)\/(?<path>.*)$/i
const turbopagesSlashSFirstRegex = /^\/s\/(?<host>[^/]+)\/(?<path>.*)$/i
const dashRegex = /-/g

const extractTurboTarget = createQueryUnwrapper({
  brands: 'yandex',
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
// Opt-in: Turbo serves a stripped-down, optimized rendering of the source page rather than the
// canonical content. Opt in by passing a custom unwrappers array.
export const unwrapYandexTurbo = createUnwrapper({
  brands: 'yandex',
  domains: 'turbopages.org',
  match: /^(?:(?:www\.)?yandex\.(?:com\.tr|[a-z]{2,3})|(?:.+\.)?turbopages\.org)$/,
  unwrap: (url) => {
    const turbopagesSubdomain = getSubdomain(url, 'turbopages.org')
    const isTurbopagesHost = turbopagesSubdomain !== undefined

    // The Turbo view runs on Yandex alone, and a host such as yandex.turbopages.org carries the
    // brand.
    if (!isTurbopagesHost) {
      const turboTarget = extractTurboTarget(url)

      if (turboTarget) {
        return turboTarget
      }
    }

    const slashSFirstRegex = isTurbopagesHost ? turbopagesSlashSFirstRegex : yandexSlashSFirstRegex
    const slashSFirstMatch = slashSFirstRegex.exec(url.pathname)

    // The query on these links is Turbo's own, such as parent-reqid or trbsrc.
    if (slashSFirstMatch?.groups) {
      return `https://${slashSFirstMatch.groups.host}/${slashSFirstMatch.groups.path}`
    }

    const hostInPathMatch = hostInPathRegex.exec(url.pathname)

    if (hostInPathMatch?.groups) {
      return `https://${hostInPathMatch.groups.host}/${hostInPathMatch.groups.path}`
    }

    if (!turbopagesSubdomain) {
      return
    }

    const match = turbopagesPathRegex.exec(url.pathname)

    if (!match?.groups) {
      return
    }

    const sourceHost = turbopagesSubdomain.replace(dashRegex, '.')

    return `https://${sourceHost}/${match.groups.path}`
  },
})
