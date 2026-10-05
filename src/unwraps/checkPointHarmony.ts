import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const hosts = [
  'avanan.url-protection.com',
  'checkpoint.url-protection.com',
  'sonicwall.url-protection.com', // SonicWall's rebrand of the same gateway
]

// A region segment, such as /r01/.
const pathRegex = /^\/v1\/(?:r\d+\/)?url$/

// Check Point Harmony Email link protection, formerly Avanan
// (checkpoint.url-protection.com/v1/url?o=<target>&g=<id>&h=<hash>).
// Opt-in: the gateway checks the target when the link is clicked, so unwrapping skips the check
// the recipient's organization put in place.
export const unwrapCheckPointHarmony: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !pathRegex.test(url.pathname)) {
    return
  }

  const target = url.searchParams.get('o')

  if (!target) {
    return
  }

  return target
}
