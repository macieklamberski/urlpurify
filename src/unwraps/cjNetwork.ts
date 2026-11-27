import { decodePercent } from 'trousse'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const hosts = [
  'www.dpbolvw.net',
  'www.tkqlhce.com',
  'www.anrdoezrs.net',
  'www.jdoqocy.com',
  'www.kqzyfj.com',
  'www.pntrac.com',
  'www.pjtra.com',
  'www.pntrs.com',
  'www.pntra.com',
  'www.gopjn.com',
  'www.pjatr.com',
  'www.qksrv.net',
  'anrdoezrs.net',
  'kqzyfj.com',
  'pjtra.com',
]

// A click link is /click-<id>-<id>[-<timestamp>], /t/<token> or a single opaque token.
const clickPathRegex = /^\/(?:t\/)?[^/]+$/i

// Optional sid/<x>/ and fragment/<x>/ segments sit before the target, which is unencoded and
// sometimes has its scheme collapsed to https:/. The fragment segment is the target's anchor,
// percent-encoded once.
const deepLinkPathRegex =
  /^\/links\/\d+\/type\/(?:dlg|am)\/(?:sid\/[^/]*\/)?(?:fragment\/([^/]*)\/)?(https?):\/\/?(.+)$/i

const extractUrlParam = createQueryUnwrapper({
  hosts,
  params: ['url', 'loc'],
})

// Commission Junction / CJ affiliate network redirects on rotating brand domains and their
// subdomains (/click-<pid>-<aid>?url=<target>, also the older loc=<target>, and the deep link
// /links/<pid>/type/dlg/[sid/<x>/][fragment/<x>/]<target>, also type/am).
export const unwrapCjNetwork = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const match = url.pathname.match(deepLinkPathRegex)

    if (!match) {
      if (!clickPathRegex.test(url.pathname)) {
        return
      }

      return extractUrlParam(url)
    }

    const [, fragment, scheme, target] = match
    const hash = fragment ? `#${decodePercent(fragment)}` : ''

    return `${scheme}://${target}${url.search}${hash}`
  },
})
