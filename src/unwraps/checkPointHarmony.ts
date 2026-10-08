import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const hosts = [
  'avanan.url-protection.com',
  'checkpoint.url-protection.com',
  'sonicwall.url-protection.com', // SonicWall's rebrand of the same gateway
]

// A region segment, such as /r01/.
const pathRegex = /^\/v1\/(?:r\d+\/)?url$/
const v2Regex = /^\/v2\/(?:r\d+\/)?___(.+)___\.[\w+/=-]+(#.*)?$/
const starEscapeRegex = /\*([0-9a-f]{2})/gi

// Check Point Harmony Email link protection (checkpoint.url-protection.com/v1/url?o=<target>, and
// protect.checkpoint.com/v2/___<target>___.<signature>). Opt-in: unwrapping skips the gateway's
// check of the target at click time, which the recipient's organization put in place.
export const unwrapCheckPointHarmony: UrlUnwrapper = (url) => {
  if (isHostOf(url, 'protect.checkpoint.com')) {
    // The v2 format writes a percent escape in the target's path as `*`, such as `*2F` for `%2F`.
    const pathname = url.pathname.replace(starEscapeRegex, '%$1')
    const match = v2Regex.exec(`${pathname}${url.search}${url.hash}`)

    if (!match?.[1] || !isHttpUrl(match[1])) {
      return
    }

    return `${match[1]}${match[2] ?? ''}`
  }

  if (!isHostOf(url, hosts) || !pathRegex.test(url.pathname)) {
    return
  }

  const target = getParamTarget(url, 'o')

  if (!target) {
    return
  }

  return target
}
