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
]

// Optional sid/<x>/ and fragment/<x>/ segments sit before the target, which is unencoded and
// sometimes has its scheme collapsed to https:/.
const deepLinkPathRegex =
  /^\/links\/\d+\/type\/dlg\/(?:(?:sid|fragment)\/[^/]*\/)*(https?):\/\/?(.+)$/

const extractUrlParam = createParamExtractor({
  hosts,
  params: ['url'],
})

// Commission Junction / CJ affiliate network redirects across rotating brand hostnames
// (?url=<target>, and the deep link /links/<pid>/type/dlg/[sid/<x>/][fragment/<x>/]<target>).
export const unwrapCjNetwork: UrlUnwrapper = (url) => {
  const match = url.pathname.match(deepLinkPathRegex)

  if (!match) {
    return extractUrlParam(url)
  }

  if (!isAnyOf(url.hostname, hosts)) {
    return
  }

  return `${match[1]}://${match[2]}${url.search}${url.hash}`
}
