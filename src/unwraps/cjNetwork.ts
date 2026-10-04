import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const hosts = [
  'www.dpbolvw.net',
  'www.tkqlhce.com',
  'www.anrdoezrs.net',
  'www.jdoqocy.com',
  'www.kqzyfj.com',
  'www.pntrac.com',
  'www.pjtra.com',
  'www.pntrs.com',
  'anrdoezrs.net',
  'kqzyfj.com',
  'pjtra.com',
]

// A click link is /click-<id>-<id>[-<timestamp>], /t/<token> or a single opaque token.
const clickPathRegex = /^\/(?:t\/)?[^/]+$/

// Optional sid/<x>/ and fragment/<x>/ segments sit before the target, which is unencoded and
// sometimes has its scheme collapsed to https:/. The fragment segment is the target's anchor,
// percent-encoded once.
const deepLinkPathRegex =
  /^\/links\/\d+\/type\/dlg\/(?:sid\/[^/]*\/)?(?:fragment\/([^/]*)\/)?(https?):\/\/?(.+)$/

const decodeFragment = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const extractUrlParam = createParamExtractor({
  hosts,
  params: ['url'],
})

// Commission Junction / CJ affiliate network redirects on rotating brand domains and their
// subdomains (/click-<pid>-<aid>?url=<target>, and the deep link
// /links/<pid>/type/dlg/[sid/<x>/][fragment/<x>/]<target>).
export const unwrapCjNetwork: UrlUnwrapper = (url) => {
  const match = url.pathname.match(deepLinkPathRegex)

  if (!match) {
    if (!clickPathRegex.test(url.pathname)) {
      return
    }

    return extractUrlParam(url)
  }

  if (!isAnyOf(url.hostname, hosts)) {
    return
  }

  const [, fragment, scheme, target] = match
  const hash = url.hash || (fragment ? `#${decodeFragment(fragment)}` : '')

  return `${scheme}://${target}${url.search}${hash}`
}
