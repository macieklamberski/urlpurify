import { decodePercent } from 'trousse'
import { resolvePathTarget } from '../pathTarget.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const hosts = [
  'dpbolvw.net',
  'www.dpbolvw.net',
  'tkqlhce.com',
  'www.tkqlhce.com',
  'anrdoezrs.net',
  'www.anrdoezrs.net',
  'jdoqocy.com',
  'www.jdoqocy.com',
  'kqzyfj.com',
  'www.kqzyfj.com',
  'pntrac.com',
  'www.pntrac.com',
  'pjtra.com',
  'www.pjtra.com',
  'pntrs.com',
  'www.pntrs.com',
  'pntra.com',
  'www.pntra.com',
  'gopjn.com',
  'www.gopjn.com',
  'pjatr.com',
  'www.pjatr.com',
  'qksrv.net',
  'www.qksrv.net',
]

// A click link is /click-<id>-<id>[-<timestamp>], /t/<token> or a single opaque token.
const clickPathRegex = /^\/(?:t\/)?[^/]+$/i

// Optional sid/<x>/ and fragment/<x>/ segments sit before the target, which is unencoded and
// sometimes has its scheme collapsed to https:/. The fragment segment is the target's anchor,
// percent-encoded once.
const deepLinkPathRegex =
  /^\/links\/\d+\/type\/(?:dlg|am)\/(?:sid\/[^/]*\/)?(?:fragment\/(?<fragment>[^/]*)\/)?(?<scheme>https?):\/\/?(?<target>.+)$/i

const extractUrlParam = createQueryUnwrapper({
  hosts,
  params: ['url', 'loc'],
})

// Commission Junction / CJ affiliate network redirects on rotating brand domains and their
// subdomains (/click-<pid>-<aid>?url=<target>, also the older loc=<target>, and the deep link
// /links/<pid>/type/dlg/[sid/<x>/][fragment/<x>/]<target>, also type/am).
// Opt-in: unwrapping removes the publisher's commission.
export const unwrapCjNetwork = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const match = deepLinkPathRegex.exec(url.pathname)

    if (!match?.groups) {
      if (!clickPathRegex.test(url.pathname)) {
        return
      }

      return extractUrlParam(url)
    }

    const { fragment, scheme, target } = match.groups
    const hash = fragment ? `#${decodePercent(fragment)}` : ''

    return `${resolvePathTarget(url, `${scheme}://${target}`)}${hash}`
  },
})
